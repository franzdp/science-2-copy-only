package com.example.data.model

enum class QuestionType {
  MULTIPLE_CHOICE,
  TRUE_FALSE,
  MULTI_SELECT,
  MATCHING,
  SORT_BUCKETS,
  ORDER_STEPS,
  HOTSPOT,
  SLIDER,
  SIMULATION,
  FILL_BLANK,
}

data class BucketCard(
  val text: String,
  val bucketIndex: Int,
)

enum class SimulationType {
  CART_PUSH,
  GRAVITY_DROP,
}

data class ScienceQuestion(
  val id: String,
  val lessonId: String,
  val type: QuestionType,
  val prompt: String,
  val answerText: String,
  val explanation: String = "",
  // Multiple Choice
  val options: List<String> = emptyList(),
  val correctIndex: Int = 0,
  // True / False
  val correctBool: Boolean = true,
  // Multi-Select (Select Pictures / Select Objects)
  val isPictureMode: Boolean = false,
  val items: List<String> = emptyList(),
  val correctIndices: List<Int> = emptyList(),
  // Matching
  val leftItems: List<String> = emptyList(),
  val rightItems: List<String> = emptyList(),
  val correctPairs: Map<Int, Int> = emptyMap(),
  // Sort Buckets
  val buckets: List<String> = emptyList(),
  val cards: List<BucketCard> = emptyList(),
  // Order Steps
  val steps: List<String> = emptyList(),
  // Hotspot
  val sceneTitle: String = "",
  val hotspots: List<String> = emptyList(),
  // Slider
  val minValue: Int = 0,
  val maxValue: Int = 30,
  val targetValue: Int = 25,
  val unit: String = "cm",
  // Simulation
  val simType: SimulationType = SimulationType.CART_PUSH,
  val choices: List<String> = emptyList(),
  // Fill Blank
  val correctAnswers: List<String> = emptyList(),
)

data class ScienceLesson(
  val id: String,
  val order: Int,
  val title: String,
  val grade: Int,
  val term: Int,
  val contentTopic: String,
  val weeks: String,
  val questions: List<ScienceQuestion>,
)

data class ScienceBadge(
  val id: String,
  val title: String,
  val description: String,
  val unlocked: Boolean,
  val progressText: String,
)

enum class ChallengeMode(
  val title: String,
  val subtitle: String,
) {
  DAILY_MIX(
    title = "Daily Science Sprint",
    subtitle = "10 mixed questions across your selected grade",
  ),
  QUICK_QUIZ(
    title = "Flash Quiz Lab",
    subtitle = "Multiple Choice & True/False speed round",
  ),
  SORT_AND_MATCH(
    title = "Sort, Match & Order",
    subtitle = "Hands-on sorting buckets, pairs & sequences",
  ),
  VISUAL_SPOTTER(
    title = "Visual & Lab Explorer",
    subtitle = "Picture picks, science diagrams & simulations",
  ),
  MISTAKE_REVIEW(
    title = "Review Missed Items",
    subtitle = "Master questions you missed earlier",
  ),
}
