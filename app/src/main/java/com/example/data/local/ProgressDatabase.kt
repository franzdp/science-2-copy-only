package com.example.data.local

import android.content.Context
import androidx.room.Dao
import androidx.room.Database
import androidx.room.Entity
import androidx.room.ForeignKey
import androidx.room.Index
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.PrimaryKey
import androidx.room.Query
import androidx.room.Room
import androidx.room.RoomDatabase
import androidx.room.Update
import androidx.room.migration.Migration
import androidx.sqlite.db.SupportSQLiteDatabase
import kotlinx.coroutines.flow.Flow

@Entity(tableName = "learner_stats")
data class LearnerStatsEntity(
  @PrimaryKey(autoGenerate = true) val id: Long = 0L,
  val learnerName: String = "Young Scientist",
  val selectedGrade: Int = 5,
  val totalXp: Int = 0,
  val currentStreak: Int = 0,
  val lastActiveDay: String = "",
  val totalCorrect: Int = 0,
  val totalAnswered: Int = 0,
  val ttsAutoRead: Boolean = false,
  val avatarIndex: Int = 0,
  val createdAt: Long = 0L,
)

@Entity(tableName = "active_learner")
data class ActiveLearnerEntity(
  @PrimaryKey val singletonId: Int = 1,
  val activeLearnerId: Long,
)

@Entity(
  tableName = "lesson_progress",
  primaryKeys = ["learnerId", "lessonId"],
  foreignKeys = [
    ForeignKey(
      entity = LearnerStatsEntity::class,
      parentColumns = ["id"],
      childColumns = ["learnerId"],
      onDelete = ForeignKey.CASCADE,
    )
  ],
  indices = [Index("learnerId")],
)
data class LessonProgressEntity(
  val learnerId: Long,
  val lessonId: String,
  val stars: Int,
  val bestScore: Int,
  val totalQuestions: Int,
  val attempts: Int,
  val completedAt: Long = System.currentTimeMillis(),
)

@Entity(
  tableName = "missed_questions",
  primaryKeys = ["learnerId", "questionId"],
  foreignKeys = [
    ForeignKey(
      entity = LearnerStatsEntity::class,
      parentColumns = ["id"],
      childColumns = ["learnerId"],
      onDelete = ForeignKey.CASCADE,
    )
  ],
  indices = [Index("learnerId")],
)
data class MistakeEntity(
  val learnerId: Long,
  val questionId: String,
  val lessonId: String,
  val timestamp: Long = System.currentTimeMillis(),
)

@Dao
interface ProgressDao {
  @Query("SELECT * FROM learner_stats ORDER BY createdAt ASC, id ASC")
  fun observeAllLearners(): Flow<List<LearnerStatsEntity>>

  @Query("SELECT * FROM learner_stats ORDER BY createdAt ASC, id ASC")
  suspend fun getAllLearnersOnce(): List<LearnerStatsEntity>

  @Query("SELECT * FROM learner_stats WHERE id = :learnerId LIMIT 1")
  suspend fun getLearnerById(learnerId: Long): LearnerStatsEntity?

  @Insert
  suspend fun insertLearner(learner: LearnerStatsEntity): Long

  @Update
  suspend fun updateLearnerStats(stats: LearnerStatsEntity)

  @Query("DELETE FROM learner_stats WHERE id = :learnerId")
  suspend fun deleteLearnerById(learnerId: Long)

  @Query("SELECT activeLearnerId FROM active_learner WHERE singletonId = 1")
  fun observeActiveLearnerId(): Flow<Long?>

  @Query("SELECT activeLearnerId FROM active_learner WHERE singletonId = 1")
  suspend fun getActiveLearnerIdOnce(): Long?

  @Insert(onConflict = OnConflictStrategy.REPLACE)
  suspend fun setActiveLearner(active: ActiveLearnerEntity)

  @Query("SELECT * FROM lesson_progress WHERE learnerId = :learnerId")
  fun observeAllLessonProgress(learnerId: Long): Flow<List<LessonProgressEntity>>

  @Query("SELECT * FROM lesson_progress")
  fun observeAllLearnersLessonProgress(): Flow<List<LessonProgressEntity>>

  @Query("SELECT * FROM lesson_progress WHERE learnerId = :learnerId AND lessonId = :lessonId LIMIT 1")
  suspend fun getLessonProgress(learnerId: Long, lessonId: String): LessonProgressEntity?

  @Insert(onConflict = OnConflictStrategy.REPLACE)
  suspend fun upsertLessonProgress(entity: LessonProgressEntity)

  @Query("SELECT * FROM missed_questions WHERE learnerId = :learnerId ORDER BY timestamp DESC")
  fun observeMistakes(learnerId: Long): Flow<List<MistakeEntity>>

  @Insert(onConflict = OnConflictStrategy.REPLACE)
  suspend fun insertMistake(entity: MistakeEntity)

  @Query("DELETE FROM missed_questions WHERE learnerId = :learnerId AND questionId = :questionId")
  suspend fun deleteMistake(learnerId: Long, questionId: String)

  @Query("DELETE FROM lesson_progress WHERE learnerId = :learnerId")
  suspend fun clearProgressForLearner(learnerId: Long)

  @Query("DELETE FROM missed_questions WHERE learnerId = :learnerId")
  suspend fun clearMistakesForLearner(learnerId: Long)
}

@Database(
  entities = [
    LearnerStatsEntity::class,
    ActiveLearnerEntity::class,
    LessonProgressEntity::class,
    MistakeEntity::class,
  ],
  version = 2,
  exportSchema = false,
)
abstract class AppDatabase : RoomDatabase() {
  abstract fun progressDao(): ProgressDao

  companion object {
    @Volatile private var INSTANCE: AppDatabase? = null

    val MIGRATION_1_2 = object : Migration(1, 2) {
      override fun migrate(db: SupportSQLiteDatabase) {
        db.execSQL(
          """
          CREATE TABLE IF NOT EXISTS `learner_stats_new` (
            `id` INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
            `learnerName` TEXT NOT NULL,
            `selectedGrade` INTEGER NOT NULL,
            `totalXp` INTEGER NOT NULL,
            `currentStreak` INTEGER NOT NULL,
            `lastActiveDay` TEXT NOT NULL,
            `totalCorrect` INTEGER NOT NULL,
            `totalAnswered` INTEGER NOT NULL,
            `ttsAutoRead` INTEGER NOT NULL,
            `avatarIndex` INTEGER NOT NULL,
            `createdAt` INTEGER NOT NULL
          )
          """.trimIndent()
        )
        db.execSQL(
          """
          INSERT INTO `learner_stats_new` (
            `id`, `learnerName`, `selectedGrade`, `totalXp`, `currentStreak`,
            `lastActiveDay`, `totalCorrect`, `totalAnswered`, `ttsAutoRead`,
            `avatarIndex`, `createdAt`
          )
          SELECT `id`, `learnerName`, `selectedGrade`, `totalXp`, `currentStreak`,
                 `lastActiveDay`, `totalCorrect`, `totalAnswered`, `ttsAutoRead`,
                 0, 0
          FROM `learner_stats`
          """.trimIndent()
        )
        db.execSQL("DROP TABLE `learner_stats`")
        db.execSQL("ALTER TABLE `learner_stats_new` RENAME TO `learner_stats`")

        // Ensure at least one learner row exists if migrating an empty v1 database
        db.execSQL(
          """
          INSERT INTO `learner_stats` (
            `learnerName`, `selectedGrade`, `totalXp`, `currentStreak`,
            `lastActiveDay`, `totalCorrect`, `totalAnswered`, `ttsAutoRead`,
            `avatarIndex`, `createdAt`
          )
          SELECT 'Young Scientist', 5, 0, 0, '', 0, 0, 0, 0, 0
          WHERE NOT EXISTS (SELECT 1 FROM `learner_stats`)
          """.trimIndent()
        )

        db.execSQL(
          """
          CREATE TABLE IF NOT EXISTS `active_learner` (
            `singletonId` INTEGER NOT NULL,
            `activeLearnerId` INTEGER NOT NULL,
            PRIMARY KEY(`singletonId`)
          )
          """.trimIndent()
        )
        db.execSQL(
          """
          INSERT OR REPLACE INTO `active_learner` (`singletonId`, `activeLearnerId`)
          VALUES (1, (SELECT MIN(`id`) FROM `learner_stats`))
          """.trimIndent()
        )

        db.execSQL(
          """
          CREATE TABLE IF NOT EXISTS `lesson_progress_new` (
            `learnerId` INTEGER NOT NULL,
            `lessonId` TEXT NOT NULL,
            `stars` INTEGER NOT NULL,
            `bestScore` INTEGER NOT NULL,
            `totalQuestions` INTEGER NOT NULL,
            `attempts` INTEGER NOT NULL,
            `completedAt` INTEGER NOT NULL,
            PRIMARY KEY(`learnerId`, `lessonId`),
            FOREIGN KEY(`learnerId`) REFERENCES `learner_stats`(`id`) ON UPDATE NO ACTION ON DELETE CASCADE
          )
          """.trimIndent()
        )
        db.execSQL(
          """
          INSERT INTO `lesson_progress_new` (
            `learnerId`, `lessonId`, `stars`, `bestScore`, `totalQuestions`, `attempts`, `completedAt`
          )
          SELECT (SELECT MIN(`id`) FROM `learner_stats`),
                 `lessonId`, `stars`, `bestScore`, `totalQuestions`, `attempts`, `completedAt`
          FROM `lesson_progress`
          """.trimIndent()
        )
        db.execSQL("DROP TABLE `lesson_progress`")
        db.execSQL("ALTER TABLE `lesson_progress_new` RENAME TO `lesson_progress`")
        db.execSQL("CREATE INDEX IF NOT EXISTS `index_lesson_progress_learnerId` ON `lesson_progress` (`learnerId`)")

        db.execSQL(
          """
          CREATE TABLE IF NOT EXISTS `missed_questions_new` (
            `learnerId` INTEGER NOT NULL,
            `questionId` TEXT NOT NULL,
            `lessonId` TEXT NOT NULL,
            `timestamp` INTEGER NOT NULL,
            PRIMARY KEY(`learnerId`, `questionId`),
            FOREIGN KEY(`learnerId`) REFERENCES `learner_stats`(`id`) ON UPDATE NO ACTION ON DELETE CASCADE
          )
          """.trimIndent()
        )
        db.execSQL(
          """
          INSERT INTO `missed_questions_new` (`learnerId`, `questionId`, `lessonId`, `timestamp`)
          SELECT (SELECT MIN(`id`) FROM `learner_stats`),
                 `questionId`, `lessonId`, `timestamp`
          FROM `missed_questions`
          """.trimIndent()
        )
        db.execSQL("DROP TABLE `missed_questions`")
        db.execSQL("ALTER TABLE `missed_questions_new` RENAME TO `missed_questions`")
        db.execSQL("CREATE INDEX IF NOT EXISTS `index_missed_questions_learnerId` ON `missed_questions` (`learnerId`)")
      }
    }

    fun getInstance(context: Context): AppDatabase {
      return INSTANCE ?: synchronized(this) {
        INSTANCE ?: Room.databaseBuilder(
          context.applicationContext,
          AppDatabase::class.java,
          "aral_science_db",
        )
          .addMigrations(MIGRATION_1_2)
          .build()
          .also { INSTANCE = it }
      }
    }
  }
}
