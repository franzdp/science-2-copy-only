package com.example

import android.content.Context
import androidx.room.Room
import androidx.test.core.app.ApplicationProvider
import com.example.data.local.AppDatabase
import com.example.data.local.CurriculumLoader
import com.example.data.repository.ScienceRepository
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.test.runTest
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Test
import org.junit.runner.RunWith
import org.robolectric.RobolectricTestRunner
import org.robolectric.annotation.Config

@RunWith(RobolectricTestRunner::class)
@Config(sdk = [36])
class ExampleRobolectricTest {

  @Test
  fun `read string from context`() {
    val context = ApplicationProvider.getApplicationContext<Context>()
    val appName = context.getString(R.string.app_name)
    assertEquals("SCIENTISTS of Bagacay ES", appName)
  }

  @Test
  fun `curriculum asset loads all grades and lessons`() = runTest {
    val context = ApplicationProvider.getApplicationContext<Context>()
    val lessons = CurriculumLoader(context).loadLessons()
    assertEquals(52, lessons.size)
    assertTrue(lessons.any { it.grade == 3 })
    assertTrue(lessons.any { it.grade == 4 })
    assertTrue(lessons.any { it.grade == 5 })
    assertTrue(lessons.any { it.grade == 6 })
    assertTrue(lessons.sumOf { it.questions.size } >= 1036)
  }

  @Test
  fun `multi learner switching keeps progress and mistakes isolated`() = runTest {
    val context = ApplicationProvider.getApplicationContext<Context>()
    val db = Room.inMemoryDatabaseBuilder(context, AppDatabase::class.java)
      .allowMainThreadQueries()
      .build()
    try {
      val repo = ScienceRepository(CurriculumLoader(context), db.progressDao())
      repo.ensureInitialStats()

      val learner1 = repo.observeLearnerStats().first()
      assertEquals("Young Scientist", learner1.learnerName)

      // Record session & mistake for Learner 1
      repo.recordQuestionResult(learner1.id, "q1", "lesson_a", isCorrect = false)
      repo.completeActivitySession(learner1.id, "lesson_a", correctCount = 9, totalCount = 10, xpEarned = 95)

      val l1Progress = repo.observeLessonProgress().first()
      assertEquals(3, l1Progress["lesson_a"]?.stars)
      assertEquals(95, repo.observeLearnerStats().first().totalXp)
      assertEquals(1, repo.observeMistakes().first().size)

      // Add Learner 2 and automatically switch to them
      val learner2Id = repo.addLearner(name = "Maria", grade = 4, avatarIndex = 2, switchToNew = true)
      val learner2 = repo.observeLearnerStats().first()
      assertEquals(learner2Id, learner2.id)
      assertEquals("Maria", learner2.learnerName)
      assertEquals(4, learner2.selectedGrade)
      assertEquals(0, learner2.totalXp)
      assertTrue(repo.observeLessonProgress().first().isEmpty())
      assertTrue(repo.observeMistakes().first().isEmpty())

      // Record separate progress for Learner 2
      repo.recordQuestionResult(learner2Id, "q99", "lesson_b", isCorrect = false)
      repo.completeActivitySession(learner2Id, "lesson_b", correctCount = 7, totalCount = 10, xpEarned = 70)

      assertEquals(2, repo.observeLessonProgress().first()["lesson_b"]?.stars)
      assertFalse(repo.observeLessonProgress().first().containsKey("lesson_a"))
      assertEquals(70, repo.observeLearnerStats().first().totalXp)
      assertEquals("q99", repo.observeMistakes().first().single().questionId)

      // Switch back to Learner 1 and verify their records are preserved independently
      repo.switchLearner(learner1.id)
      val backToL1 = repo.observeLearnerStats().first()
      assertEquals(learner1.id, backToL1.id)
      assertEquals(95, backToL1.totalXp)
      assertEquals(3, repo.observeLessonProgress().first()["lesson_a"]?.stars)
      assertFalse(repo.observeLessonProgress().first().containsKey("lesson_b"))
      assertEquals("q1", repo.observeMistakes().first().single().questionId)

      // Resetting Learner 1 must not clear Learner 2
      repo.resetProgress()
      assertEquals(0, repo.observeLearnerStats().first().totalXp)
      assertTrue(repo.observeLessonProgress().first().isEmpty())

      repo.switchLearner(learner2Id)
      assertEquals(70, repo.observeLearnerStats().first().totalXp)
      assertEquals(2, repo.observeLessonProgress().first()["lesson_b"]?.stars)
    } finally {
      db.close()
    }
  }
}
