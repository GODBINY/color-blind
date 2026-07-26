export type VisionPlateAnswer = {
  id: string;
  answer: string;
};

export function scoreVisionResponses(
  plates: readonly VisionPlateAnswer[],
  responses: readonly string[],
) {
  const entries = plates.map((plate, index) => {
    const response = responses[index] ?? "";
    return { ...plate, response, isMatch: response === plate.answer };
  });

  return {
    matched: entries.filter((entry) => entry.isMatch).length,
    incorrect: entries.filter((entry) => !entry.isMatch),
  };
}
