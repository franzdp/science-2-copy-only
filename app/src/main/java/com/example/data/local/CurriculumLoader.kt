package com.example.data.local

import android.content.Context
import com.example.data.model.BucketCard
import com.example.data.model.QuestionType
import com.example.data.model.ScienceLesson
import com.example.data.model.ScienceQuestion
import com.example.data.model.SimulationType
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import org.json.JSONArray
import org.json.JSONObject

class CurriculumLoader(private val context: Context) {

  suspend fun loadLessons(): List<ScienceLesson> = withContext(Dispatchers.IO) {
    val jsonText = context.assets.open("science_curriculum.json")
      .bufferedReader()
      .use { it.readText() }
    val root = JSONObject(jsonText)
    val lessonsArray = root.getJSONArray("lessons")
    buildList(lessonsArray.length()) {
      for (i in 0 until lessonsArray.length()) {
        add(parseLesson(lessonsArray.getJSONObject(i)))
      }
    }
  }

  private fun parseLesson(obj: JSONObject): ScienceLesson {
    val id = obj.getString("id")
    val qArray = obj.getJSONArray("questions")
    val questions = buildList(qArray.length()) {
      for (i in 0 until qArray.length()) {
        add(parseQuestion(qArray.getJSONObject(i), id))
      }
    }
    return ScienceLesson(
      id = id,
      order = obj.getInt("order"),
      title = obj.getString("title"),
      grade = obj.getInt("grade"),
      term = obj.getInt("term"),
      contentTopic = obj.getString("contentTopic"),
      weeks = obj.getString("weeks"),
      questions = questions,
    )
  }

  private fun parseQuestion(obj: JSONObject, lessonId: String): ScienceQuestion {
    val type = QuestionType.valueOf(obj.getString("type"))
    val options = obj.optJSONArray("options").toStringList()
    val items = obj.optJSONArray("items").toStringList()
    val correctIndices = obj.optJSONArray("correctIndices").toIntList()
    val leftItems = obj.optJSONArray("leftItems").toStringList()
    val rightItems = obj.optJSONArray("rightItems").toStringList()
    val pairsObj = obj.optJSONObject("correctPairs")
    val correctPairs = buildMap {
      if (pairsObj != null) {
        val keys = pairsObj.keys()
        while (keys.hasNext()) {
          val k = keys.next()
          put(k.toInt(), pairsObj.getInt(k))
        }
      }
    }
    val buckets = obj.optJSONArray("buckets").toStringList()
    val cardsArr = obj.optJSONArray("cards")
    val cards = buildList {
      if (cardsArr != null) {
        for (i in 0 until cardsArr.length()) {
          val cObj = cardsArr.getJSONObject(i)
          add(BucketCard(text = cObj.getString("text"), bucketIndex = cObj.getInt("bucketIndex")))
        }
      }
    }
    val steps = obj.optJSONArray("steps").toStringList()
    val hotspots = obj.optJSONArray("hotspots").toStringList()
    val choices = obj.optJSONArray("choices").toStringList()
    val correctAnswers = obj.optJSONArray("correctAnswers").toStringList()
    val simStr = obj.optString("simType", "CART_PUSH")
    val simType = if (simStr == "GRAVITY_DROP") SimulationType.GRAVITY_DROP else SimulationType.CART_PUSH

    return ScienceQuestion(
      id = obj.getString("id"),
      lessonId = lessonId,
      type = type,
      prompt = obj.getString("prompt"),
      answerText = obj.optString("answerText", ""),
      explanation = obj.optString("explanation", ""),
      options = options,
      correctIndex = obj.optInt("correctIndex", 0),
      correctBool = obj.optBoolean("correctBool", true),
      isPictureMode = obj.optBoolean("isPictureMode", false),
      items = items,
      correctIndices = correctIndices,
      leftItems = leftItems,
      rightItems = rightItems,
      correctPairs = correctPairs,
      buckets = buckets,
      cards = cards,
      steps = steps,
      sceneTitle = obj.optString("sceneTitle", ""),
      hotspots = hotspots,
      minValue = obj.optInt("minValue", 0),
      maxValue = obj.optInt("maxValue", 30),
      targetValue = obj.optInt("targetValue", 25),
      unit = obj.optString("unit", "cm"),
      simType = simType,
      choices = choices,
      correctAnswers = correctAnswers,
    )
  }

  private fun JSONArray?.toStringList(): List<String> {
    if (this == null) return emptyList()
    return buildList(length()) {
      for (i in 0 until length()) add(getString(i))
    }
  }

  private fun JSONArray?.toIntList(): List<Int> {
    if (this == null) return emptyList()
    return buildList(length()) {
      for (i in 0 until length()) add(getInt(i))
    }
  }
}
