import Upload from "../models/Upload.js";
import dotenv from "dotenv";
dotenv.config();

// Utility: basic stats for numeric columns
const computeColumnStats = (rows, key) => {
  const values = rows
    .map((r) => Number(r?.[key]))
    .filter((v) => typeof v === "number" && !Number.isNaN(v));
  if (values.length === 0) return null;

  const count = values.length;
  const sum = values.reduce((a, b) => a + b, 0);
  const mean = sum / count;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const variance =
    count > 1
      ? values.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0) / (count - 1)
      : 0;
  const std = Math.sqrt(variance);
  return { count, mean, min, max, std };
};

// GET /api/insights/:uploadId
export const getInsightSummary = async (req, res) => {
  try {
    const { uploadId } = req.params;
    if (!uploadId) return res.status(400).json({ message: "uploadId is required" });

    // Ensure the upload belongs to the requesting user
    const upload = await Upload.findById(uploadId);
    if (!upload) return res.status(404).json({ message: "Upload not found" });
    if (String(upload.user) !== String(req.user.id)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const rows = Array.isArray(upload.parsedData) ? upload.parsedData : [];
    if (rows.length === 0) return res.status(200).json({ summary: "No data rows found in this file.", metrics: {}, filename: upload.filename });

    const keys = Object.keys(rows[0] || {});

    // Identify numeric columns and compute basic stats
    const metrics = {};
    keys.forEach((key) => {
      const stats = computeColumnStats(rows, key);
      if (stats) metrics[key] = stats;
    });

    // Try to infer a year/temporal column
    const yearKey = keys.find((k) => /year|date/i.test(k));
    let yearsSpanText = "";
    if (yearKey) {
      const years = rows
        .map((r) => Number(r?.[yearKey]))
        .filter((v) => !Number.isNaN(v));
      if (years.length) {
        const minY = Math.min(...years);
        const maxY = Math.max(...years);
        const span = maxY - minY + 1;
        yearsSpanText = `The data spans ${span} ${span > 1 ? "years" : "year"} (${minY}–${maxY}).`;
      }
    }

  // Build a single-paragraph narrative summary like the provided example
    const numericCols = Object.keys(metrics);

    // Utilities
    const fmt = (n, digits = 2) => (Number.isFinite(n) ? Number(n).toLocaleString("en-US", { maximumFractionDigits: digits }) : "N/A");
    const arrOf = (col) => rows.map((r) => Number(r?.[col])).filter((v) => Number.isFinite(v));
    const sum = (a) => a.reduce((x, y) => x + y, 0);
    const pearson = (x, y) => {
      const n = Math.min(x.length, y.length);
      if (n < 3) return NaN;
      const mx = x.reduce((a, b) => a + b, 0) / n;
      const my = y.reduce((a, b) => a + b, 0) / n;
      let num = 0, dx = 0, dy = 0;
      for (let i = 0; i < n; i++) {
        const vx = x[i] - mx;
        const vy = y[i] - my;
        num += vx * vy;
        dx += vx * vx;
        dy += vy * vy;
      }
      const den = Math.sqrt(dx * dy);
      return den ? num / den : NaN;
    };

    // Try to detect business-friendly columns
    const findCol = (re) => keys.find((k) => re.test(k));
    const revenueCol = findCol(/revenue|sales?_?(amount|total)?|turnover|total_?revenue|gross_?sales/i);
    const qtyCol = findCol(/qty|quantity|units?|unit_?sold|pieces|item_?count/i);
    const priceCol = findCol(/price|unit[_\s-]?price|cost[_\s-]?per[_\s-]?unit|rate/i);

    const revArr = revenueCol ? arrOf(revenueCol) : [];
    const qtyArr = qtyCol ? arrOf(qtyCol) : [];
    const totalRevenue = revArr.length ? sum(revArr) : null;
    const totalQty = qtyArr.length ? sum(qtyArr) : null;
    const avgPrice = priceCol && metrics[priceCol] ? metrics[priceCol].mean : null;

    // Quantity-Revenue correlation
    let corrSnippet = null;
    if (revArr.length && qtyArr.length) {
      const n = Math.min(revArr.length, qtyArr.length);
      const r = pearson(revArr.slice(0, n), qtyArr.slice(0, n));
      if (Number.isFinite(r)) {
        const strength = Math.abs(r) >= 0.6 ? "strong" : Math.abs(r) >= 0.3 ? "moderate" : "weak";
        const direction = r >= 0 ? "positive" : "negative";
        corrSnippet = `The ${qtyCol || "quantity"} shows a ${strength} ${direction} correlation with ${revenueCol || "revenue"} (r = ${fmt(r, 2)}).`;
      }
    }

    // Compose 3–5 insights
    const intro = `Based on the provided summary statistics from the Excel data, we can draw the following insights:`;
    const insights = [];

    if (totalQty !== null || totalRevenue !== null) {
      const parts = [];
      if (totalQty !== null) parts.push(`a total of ${fmt(totalQty)} units sold`);
      if (totalRevenue !== null) parts.push(`total ${revenueCol || "revenue"} of ${fmt(totalRevenue)}`);
      const suffix = yearsSpanText ? ` ${yearsSpanText}` : "";
      insights.push(`1. **Total Performance**: ${parts.join(", ")} were recorded.${suffix}`);
    }

    if (avgPrice !== null) {
      const std = metrics[priceCol]?.std;
      insights.push(`2. **Pricing Analysis**: The average ${priceCol || "price"} is ${fmt(avgPrice)}${Number.isFinite(std) ? ` (σ ≈ ${fmt(std)})` : ""}.`);
    }

    if (corrSnippet) {
      insights.push(`3. **Quantity and Revenue Correlation**: ${corrSnippet}`);
    }

    // Fallbacks from stats if needed
    if (insights.length < 3 && numericCols.length) {
      const means = numericCols
        .map((k) => ({ k, mean: metrics[k].mean }))
        .sort((a, b) => b.mean - a.mean)
        .slice(0, Math.min(3, numericCols.length));
      if (means.length) {
        insights.push(`${insights.length + 1}. **Top Averages**: ${means.map((m) => `${m.k}: ${fmt(m.mean)}`).join(", ")}.`);
      }
      const variability = numericCols
        .map((k) => ({ k, std: metrics[k].std }))
        .sort((a, b) => b.std - a.std);
      if (variability[0]) {
        insights.push(`${insights.length + 1}. **Variability**: Highest variability observed in '${variability[0].k}' (σ ≈ ${fmt(variability[0].std)}).`);
      }
    }

    if (!insights.length) {
      insights.push(`1. **Overview**: No strong numeric insights detected.`);
    }

    let summaryText = `${intro} ${insights.join(" ")}`;
  let summarySource = "rule-based";
  let modelUsed = null;

  // If OpenAI is configured, ask it to write a concise, user-friendly summary
  if (process.env.OPENAI_API_KEY) {
      try {
    const { default: OpenAI } = await import("openai");
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const prompt = `You are a data analyst. Write a single-paragraph narrative like this style: \n"Based on the provided summary statistics from the Excel data, we can draw the following insights: 1. **Total Performance**: ... 2. **Pricing Analysis**: ... 3. **Quantity and Revenue Correlation**: ..."\nUse 3–5 numbered insights, each with a short bold title followed by a concise explanation with rounded numbers. Avoid inventing columns. Include time span if present.

Years: ${yearsSpanText || "N/A"}
Row count: ${rows.length}
Columns: ${keys.length}
Metrics (JSON): ${JSON.stringify(metrics)}
`;
        modelUsed = process.env.OPENAI_MODEL || "gpt-4o-mini";
        const completion = await openai.chat.completions.create({
          model: modelUsed,
          messages: [
      { role: "system", content: "You write brief, neutral data insights as a single paragraph with numbered, bold-titled insights." },
            { role: "user", content: prompt },
          ],
          temperature: 0.4,
          max_tokens: 250,
        });
        const aiText = completion.choices?.[0]?.message?.content?.trim();
        if (aiText) {
          summaryText = aiText;
          summarySource = "openai";
        }
      } catch (e) {
        // If OpenAI fails, keep the basic summary
      }
    }

    res.json({
      filename: upload.filename,
      metrics,
      summary: summaryText,
      rowCount: rows.length,
      summarySource,
      model: modelUsed,
    });
  } catch (err) {
    console.error("Insight error:", err);
    res.status(500).json({ message: "Failed to generate insights" });
  }
};
