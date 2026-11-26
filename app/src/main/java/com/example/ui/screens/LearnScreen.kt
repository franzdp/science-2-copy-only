package com.example.ui.screens

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.layout.widthIn
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.rounded.AutoAwesome
import androidx.compose.material.icons.rounded.Close
import androidx.compose.material.icons.rounded.Group
import androidx.compose.material.icons.rounded.LocalFireDepartment
import androidx.compose.material.icons.rounded.PlayArrow
import androidx.compose.material.icons.rounded.Search
import androidx.compose.material.icons.rounded.Star
import androidx.compose.material.icons.rounded.StarBorder
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.FilterChip
import androidx.compose.material3.FilterChipDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.minimumInteractiveComponentSize
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import com.example.R
import com.example.data.local.LessonProgressEntity
import com.example.data.model.ScienceLesson
import com.example.ui.components.LearnerAvatarBadge
import com.example.ui.theme.CoralError
import com.example.ui.theme.LeafSecondary
import com.example.ui.theme.SkyPrimary
import com.example.ui.theme.SkyPrimaryBright
import com.example.ui.theme.SunGold
import com.example.ui.theme.VioletAccent
import com.example.ui.viewmodel.AppUiState

@Composable
fun LearnScreen(
  uiState: AppUiState,
  onSelectGrade: (Int) -> Unit,
  onSelectTerm: (Int?) -> Unit,
  onSearchChange: (String) -> Unit,
  onStartLesson: (ScienceLesson) -> Unit,
  onOpenLearnerSwitcher: () -> Unit,
  modifier: Modifier = Modifier,
) {
  val gradeLessons = uiState.allLessons.filter { it.grade == uiState.selectedGrade }
  val nextLesson = gradeLessons.firstOrNull { (uiState.progressMap[it.id]?.stars ?: 0) == 0 }
    ?: gradeLessons.firstOrNull()

  Box(
    modifier = modifier.fillMaxSize(),
    contentAlignment = Alignment.TopCenter,
  ) {
    LazyColumn(
      modifier = Modifier
        .widthIn(max = 680.dp)
        .fillMaxSize(),
      contentPadding = PaddingValues(horizontal = 16.dp, vertical = 14.dp),
      verticalArrangement = Arrangement.spacedBy(14.dp),
    ) {
      // Branded School Header Card with Logo & Innovator Credit
      item {
        Surface(
          shape = RoundedCornerShape(20.dp),
          color = MaterialTheme.colorScheme.surface,
          border = BorderStroke(1.2.dp, SkyPrimary.copy(alpha = 0.28f)),
          modifier = Modifier
            .fillMaxWidth()
            .testTag("school_brand_header"),
        ) {
          Row(
            modifier = Modifier.padding(horizontal = 14.dp, vertical = 10.dp),
            verticalAlignment = Alignment.CenterVertically,
          ) {
            Image(
              painter = painterResource(id = R.drawable.ic_launcher_art),
              contentDescription = "SCIENTISTS of Bagacay ES Logo",
              contentScale = ContentScale.Crop,
              modifier = Modifier
                .size(48.dp)
                .clip(RoundedCornerShape(14.dp)),
            )
            Spacer(Modifier.width(12.dp))
            Column(modifier = Modifier.weight(1f)) {
              Text(
                text = "SCIENTISTS of Bagacay ES",
                style = MaterialTheme.typography.titleMedium,
                color = SkyPrimary,
                fontWeight = FontWeight.Bold,
              )
              Text(
                text = "This is innovated by FRANZ D. PADOJINOG",
                style = MaterialTheme.typography.labelSmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
              )
            }
          }
        }
      }

      // Top Learner Greeting, Switcher & Stats Strip
      item {
        Row(
          modifier = Modifier.fillMaxWidth(),
          horizontalArrangement = Arrangement.SpaceBetween,
          verticalAlignment = Alignment.CenterVertically,
        ) {
          Row(
            verticalAlignment = Alignment.CenterVertically,
            modifier = Modifier
              .weight(1f)
              .clip(RoundedCornerShape(14.dp))
              .clickable { onOpenLearnerSwitcher() }
              .padding(vertical = 4.dp),
          ) {
            LearnerAvatarBadge(
              avatarIndex = uiState.stats.avatarIndex,
              size = 48.dp,
              contentDescription = "${uiState.stats.learnerName} Avatar",
            )
            Spacer(Modifier.width(10.dp))
            Column {
              Text(
                text = "Hi, ${uiState.stats.learnerName}!",
                style = MaterialTheme.typography.titleLarge,
                maxLines = 1,
                overflow = TextOverflow.Ellipsis,
              )
              Text(
                text = "Grade ${uiState.selectedGrade} • ${uiState.stats.totalXp} XP",
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
              )
            }
          }
          Spacer(Modifier.width(6.dp))
          Row(
            horizontalArrangement = Arrangement.spacedBy(6.dp),
            verticalAlignment = Alignment.CenterVertically,
          ) {
            Surface(
              onClick = onOpenLearnerSwitcher,
              shape = RoundedCornerShape(50),
              color = SkyPrimary.copy(alpha = 0.12f),
              border = BorderStroke(1.dp, SkyPrimary.copy(alpha = 0.3f)),
              modifier = Modifier
                .minimumInteractiveComponentSize()
                .testTag("switch_learner_button"),
            ) {
              Row(
                modifier = Modifier.padding(horizontal = 10.dp, vertical = 8.dp),
                verticalAlignment = Alignment.CenterVertically,
              ) {
                Icon(
                  imageVector = Icons.Rounded.Group,
                  contentDescription = "Switch or add learner",
                  tint = SkyPrimary,
                  modifier = Modifier.size(16.dp),
                )
                Spacer(Modifier.width(4.dp))
                Text(
                  text = if (uiState.learners.size > 1) "Switch (${uiState.learners.size})" else "Switch",
                  style = MaterialTheme.typography.labelMedium,
                  color = SkyPrimary,
                  fontWeight = FontWeight.Bold,
                )
              }
            }
            StatPill(
              icon = Icons.Rounded.Star,
              value = "${uiState.totalStars}",
              tint = SunGold,
              bg = SunGold.copy(alpha = 0.16f),
            )
          }
        }
      }

      // Hero Continue Learning Card
      if (nextLesson != null) {
        item {
          Surface(
            shape = RoundedCornerShape(24.dp),
            shadowElevation = 4.dp,
            modifier = Modifier
              .fillMaxWidth()
              .testTag("hero_continue_card"),
          ) {
            Box(
              modifier = Modifier
                .fillMaxWidth()
                .height(190.dp)
            ) {
              Image(
                painter = painterResource(id = R.drawable.img_science_hero),
                contentDescription = "Science Hero Illustration",
                contentScale = ContentScale.Crop,
                modifier = Modifier.fillMaxSize(),
              )
              Box(
                modifier = Modifier
                  .fillMaxSize()
                  .background(
                    Brush.horizontalGradient(
                      colors = listOf(
                        Color(0xFF0C4A6E).copy(alpha = 0.92f),
                        Color(0xFF0284C7).copy(alpha = 0.65f),
                        Color.Transparent,
                      )
                    )
                  )
              )
              Column(
                modifier = Modifier
                  .fillMaxSize()
                  .padding(18.dp),
                verticalArrangement = Arrangement.SpaceBetween,
              ) {
                Surface(
                  color = Color.White.copy(alpha = 0.22f),
                  shape = RoundedCornerShape(50),
                ) {
                  Row(
                    modifier = Modifier.padding(horizontal = 10.dp, vertical = 4.dp),
                    verticalAlignment = Alignment.CenterVertically,
                  ) {
                    Icon(
                      Icons.Rounded.AutoAwesome,
                      contentDescription = null,
                      tint = Color(0xFFFDE047),
                      modifier = Modifier.size(14.dp),
                    )
                    Spacer(Modifier.width(4.dp))
                    Text(
                      text = "RECOMMENDED NEXT",
                      style = MaterialTheme.typography.labelSmall,
                      color = Color.White,
                      fontWeight = FontWeight.Bold,
                    )
                  }
                }
                Column {
                  Text(
                    text = nextLesson.title,
                    style = MaterialTheme.typography.headlineSmall,
                    color = Color.White,
                    maxLines = 2,
                    overflow = TextOverflow.Ellipsis,
                  )
                  Text(
                    text = "Grade ${nextLesson.grade} • Term ${nextLesson.term} • ${nextLesson.weeks}",
                    style = MaterialTheme.typography.bodySmall,
                    color = Color.White.copy(alpha = 0.9f),
                  )
                }
                Button(
                  onClick = { onStartLesson(nextLesson) },
                  colors = ButtonDefaults.buttonColors(
                    containerColor = Color(0xFFFBBF24),
                    contentColor = Color(0xFF422006),
                  ),
                  shape = RoundedCornerShape(14.dp),
                  modifier = Modifier.testTag("hero_start_button"),
                ) {
                  Icon(Icons.Rounded.PlayArrow, contentDescription = null, modifier = Modifier.size(20.dp))
                  Spacer(Modifier.width(6.dp))
                  Text("Start Lesson", fontWeight = FontWeight.Bold)
                }
              }
            }
          }
        }
      }

      // Grade Level Selector Pills (Grade 3, 4, 5, 6)
      item {
        Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
          Text("Choose Grade Level", style = MaterialTheme.typography.titleMedium)
          Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(8.dp),
          ) {
            listOf(3, 4, 5, 6).forEach { grade ->
              val selected = uiState.selectedGrade == grade
              val gradeColor = when (grade) {
                3 -> LeafSecondary
                4 -> SkyPrimary
                5 -> VioletAccent
                else -> SunGold
              }
              Surface(
                onClick = { onSelectGrade(grade) },
                shape = RoundedCornerShape(16.dp),
                color = if (selected) gradeColor else MaterialTheme.colorScheme.surface,
                border = BorderStroke(
                  1.5.dp,
                  if (selected) gradeColor else MaterialTheme.colorScheme.outline.copy(alpha = 0.6f),
                ),
                modifier = Modifier
                  .weight(1f)
                  .height(48.dp)
                  .testTag("grade_pill_$grade"),
              ) {
                Box(contentAlignment = Alignment.Center) {
                  Text(
                    text = "Grade $grade",
                    style = MaterialTheme.typography.labelLarge,
                    color = if (selected) Color.White else MaterialTheme.colorScheme.onSurface,
                  )
                }
              }
            }
          }
        }
      }

      // Term Filter Chips + Search Bar
      item {
        Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
          LazyRow(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            val terms: List<Pair<Int?, String>> = listOf(
              null to "All Terms",
              1 to "Term 1",
              2 to "Term 2",
              3 to "Term 3",
            )
            items(terms) { (termVal, label) ->
              FilterChip(
                selected = uiState.selectedTerm == termVal,
                onClick = { onSelectTerm(termVal) },
                label = { Text(label) },
                colors = FilterChipDefaults.filterChipColors(
                  selectedContainerColor = MaterialTheme.colorScheme.primaryContainer,
                  selectedLabelColor = MaterialTheme.colorScheme.onPrimaryContainer,
                ),
                modifier = Modifier.testTag("term_chip_${termVal ?: "all"}"),
              )
            }
          }

          OutlinedTextField(
            value = uiState.searchQuery,
            onValueChange = onSearchChange,
            placeholder = { Text("Search topics (e.g. Matter, Volcano, Circuits)...") },
            leadingIcon = { Icon(Icons.Rounded.Search, contentDescription = null) },
            trailingIcon = {
              if (uiState.searchQuery.isNotEmpty()) {
                IconButton(onClick = { onSearchChange("") }) {
                  Icon(Icons.Rounded.Close, contentDescription = "Clear search")
                }
              }
            },
            singleLine = true,
            shape = RoundedCornerShape(16.dp),
            colors = OutlinedTextFieldDefaults.colors(
              focusedContainerColor = MaterialTheme.colorScheme.surface,
              unfocusedContainerColor = MaterialTheme.colorScheme.surface,
            ),
            modifier = Modifier
              .fillMaxWidth()
              .testTag("lesson_search_input"),
          )
        }
      }

      // Lesson List
      val lessons = uiState.filteredLessons
      if (lessons.isEmpty()) {
        item {
          Surface(
            shape = RoundedCornerShape(20.dp),
            color = MaterialTheme.colorScheme.surface,
            modifier = Modifier.fillMaxWidth(),
          ) {
            Column(
              modifier = Modifier.padding(28.dp),
              horizontalAlignment = Alignment.CenterHorizontally,
            ) {
              Icon(
                Icons.Rounded.Search,
                contentDescription = null,
                tint = MaterialTheme.colorScheme.primary,
                modifier = Modifier.size(44.dp),
              )
              Spacer(Modifier.height(8.dp))
              Text("No matching lessons found", style = MaterialTheme.typography.titleMedium)
              Text(
                "Try switching terms or clearing your search.",
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
              )
            }
          }
        }
      } else {
        items(lessons, key = { it.id }) { lesson ->
          LessonModuleCard(
            lesson = lesson,
            progress = uiState.progressMap[lesson.id],
            onClick = { onStartLesson(lesson) },
          )
        }
      }
      item { Spacer(Modifier.height(12.dp)) }
    }
  }
}

@Composable
private fun StatPill(
  icon: androidx.compose.ui.graphics.vector.ImageVector,
  value: String,
  tint: Color,
  bg: Color,
) {
  Surface(
    color = bg,
    shape = RoundedCornerShape(50),
  ) {
    Row(
      modifier = Modifier.padding(horizontal = 10.dp, vertical = 6.dp),
      verticalAlignment = Alignment.CenterVertically,
    ) {
      Icon(icon, contentDescription = null, tint = tint, modifier = Modifier.size(18.dp))
      Spacer(Modifier.width(4.dp))
      Text(value, style = MaterialTheme.typography.labelLarge, color = tint)
    }
  }
}

@Composable
private fun LessonModuleCard(
  lesson: ScienceLesson,
  progress: LessonProgressEntity?,
  onClick: () -> Unit,
) {
  val stars = progress?.stars ?: 0
  val termColor = when (lesson.term) {
    1 -> SkyPrimary
    2 -> LeafSecondary
    else -> VioletAccent
  }
  Surface(
    onClick = onClick,
    shape = RoundedCornerShape(20.dp),
    color = MaterialTheme.colorScheme.surface,
    tonalElevation = 1.dp,
    border = BorderStroke(
      1.dp,
      if (stars > 0) termColor.copy(alpha = 0.45f) else MaterialTheme.colorScheme.outline.copy(alpha = 0.45f),
    ),
    modifier = Modifier
      .fillMaxWidth()
      .testTag("lesson_card_${lesson.id}"),
  ) {
    Column(modifier = Modifier.padding(16.dp)) {
      Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically,
      ) {
        Row(
          horizontalArrangement = Arrangement.spacedBy(8.dp),
          verticalAlignment = Alignment.CenterVertically,
        ) {
          Surface(
            color = termColor.copy(alpha = 0.14f),
            shape = RoundedCornerShape(8.dp),
          ) {
            Text(
              text = "Term ${lesson.term} • ${lesson.weeks}",
              style = MaterialTheme.typography.labelSmall,
              color = termColor,
              fontWeight = FontWeight.Bold,
              modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
            )
          }
          Text(
            text = "${lesson.questions.size} items",
            style = MaterialTheme.typography.labelSmall,
            color = MaterialTheme.colorScheme.onSurfaceVariant,
          )
        }
        Row(horizontalArrangement = Arrangement.spacedBy(2.dp)) {
          for (s in 1..3) {
            Icon(
              imageVector = if (s <= stars) Icons.Rounded.Star else Icons.Rounded.StarBorder,
              contentDescription = null,
              tint = if (s <= stars) SunGold else MaterialTheme.colorScheme.outline,
              modifier = Modifier.size(20.dp),
            )
          }
        }
      }
      Spacer(Modifier.height(10.dp))
      Text(
        text = lesson.title,
        style = MaterialTheme.typography.titleMedium,
        color = MaterialTheme.colorScheme.onSurface,
      )
      Spacer(Modifier.height(2.dp))
      Text(
        text = lesson.contentTopic,
        style = MaterialTheme.typography.bodySmall,
        color = MaterialTheme.colorScheme.onSurfaceVariant,
      )
      if (progress != null && progress.totalQuestions > 0) {
        Spacer(Modifier.height(10.dp))
        val ratio = (progress.bestScore.toFloat() / progress.totalQuestions).coerceIn(0f, 1f)
        Row(verticalAlignment = Alignment.CenterVertically) {
          LinearProgressIndicator(
            progress = { ratio },
            color = termColor,
            trackColor = termColor.copy(alpha = 0.16f),
            modifier = Modifier
              .weight(1f)
              .height(7.dp)
              .clip(RoundedCornerShape(50)),
          )
          Spacer(Modifier.width(10.dp))
          Text(
            text = "Best: ${progress.bestScore}/${progress.totalQuestions}",
            style = MaterialTheme.typography.labelSmall,
            color = termColor,
            fontWeight = FontWeight.Bold,
          )
        }
      }
    }
  }
}
