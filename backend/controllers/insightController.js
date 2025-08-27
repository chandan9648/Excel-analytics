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

  // Build a simple human-readable summary
    const numericCols = Object.keys(metrics);
    let bullets = [];
    if (yearsSpanText) bullets.push(`Temporal context: ${yearsSpanText}`);

    if (numericCols.length) {
      const means = numericCols
        .map((k) => ({ k, mean: metrics[k].mean }))
        .sort((a, b) => b.mean - a.mean);
      const top = means.slice(0, Math.min(3, means.length));
      bullets.push(
        `Top averages: ${top
          .map((t) => `${t.k}: ${t.mean.toFixed(2)}`)
          .join(", ")}.`
      );

      const variability = numericCols
        .map((k) => ({ k, std: metrics[k].std }))
        .sort((a, b) => b.std - a.std);
      const mostVariable = variability[0];
      if (mostVariable) {
        bullets.push(
          `Highest variability observed in '${mostVariable.k}' (σ ≈ ${mostVariable.std.toFixed(
            2
          )}).`
        );
      }
    } else {
      bullets.push("No numeric columns were detected for statistical analysis.");
    }

  let summaryText = `Based on the dataset '${upload.filename}', here are a few highlights: ${bullets
      .map((b, i) => `${i + 1}. ${b}`)
      .join(" ")}`;
  let summarySource = "rule-based";
  let modelUsed = null;

  // If OpenAI is configured, ask it to write a concise, user-friendly summary
  if (process.env.OPENAI_API_KEY) {
      try {
    const { default: OpenAI } = await import("openai");
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
        const prompt = `You are a data analyst. Given the following column statistics and optional time span, write a concise, clear, user-friendly insight summary in 3-6 sentences. Avoid hallucinating columns.

Years: ${yearsSpanText || "N/A"}
Row count: ${rows.length}
Metrics (JSON): ${JSON.stringify(metrics)}
`;
        modelUsed = process.env.OPENAI_MODEL || "gpt-4o-mini";
        const completion = await openai.chat.completions.create({
          model: modelUsed,
          messages: [
            { role: "system", content: "You write brief, neutral data insights." },
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
