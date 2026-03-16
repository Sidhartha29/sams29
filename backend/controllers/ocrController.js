const Tesseract = require("tesseract.js");
const fs = require("fs");

// Activity type keywords mapping
const ACTIVITY_KEYWORDS = {
  hackathon: ["hackathon", "hack", "coding challenge", "code sprint", "devpost", "hackerearth"],
  internship: ["internship", "intern", "training", "industrial training", "apprentice"],
  research: ["research", "paper", "publication", "journal", "conference paper", "ieee", "springer"],
  sports: ["sports", "athlete", "tournament", "championship", "medal", "cricket", "football", "badminton", "kabaddi"],
  workshop: ["workshop", "seminar", "webinar", "training program", "bootcamp", "hands-on"],
  cultural: ["cultural", "dance", "music", "art", "drama", "literary", "fest"],
  technical: ["technical", "competition", "olympiad", "quiz", "robotics", "project expo"]
};

// @desc    OCR scan certificate and suggest activity type
// @route   POST /api/ocr/suggest
exports.suggestActivityType = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const filePath = req.file.path;

    // Run Tesseract OCR
    const { data: { text } } = await Tesseract.recognize(filePath, "eng", {
      logger: () => {} // suppress logs
    });

    // Clean up temp file
    fs.unlinkSync(filePath);

    const lowerText = text.toLowerCase();

    // Score each activity type
    let bestMatch = "other";
    let bestScore = 0;

    for (const [activityType, keywords] of Object.entries(ACTIVITY_KEYWORDS)) {
      let score = 0;
      for (const keyword of keywords) {
        if (lowerText.includes(keyword)) {
          score++;
        }
      }
      if (score > bestScore) {
        bestScore = score;
        bestMatch = activityType;
      }
    }

    res.json({
      extractedText: text.substring(0, 500),
      suggestedActivityType: bestMatch,
      confidence: bestScore > 0 ? "match_found" : "no_match",
      allScores: Object.entries(ACTIVITY_KEYWORDS).reduce((acc, [type, keywords]) => {
        acc[type] = keywords.filter(kw => lowerText.includes(kw)).length;
        return acc;
      }, {})
    });
  } catch (error) {
    console.error("OCR Error:", error);
    res.status(500).json({ message: "OCR processing failed", error: error.message });
  }
};
