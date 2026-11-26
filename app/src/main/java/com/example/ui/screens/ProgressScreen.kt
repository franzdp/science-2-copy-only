package com.example.ui.screens

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.Image
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
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.rounded.Add
import androidx.compose.material.icons.rounded.CheckCircle
import androidx.compose.material.icons.rounded.Edit
import androidx.compose.material.icons.rounded.EmojiEvents
import androidx.compose.material.icons.rounded.Group
import androidx.compose.material.icons.rounded.LocalFireDepartment
import androidx.compose.material.icons.rounded.Lock
import androidx.compose.material.icons.rounded.RecordVoiceOver
import androidx.compose.material.icons.rounded.RestartAlt
import androidx.compose.material.icons.rounded.Star
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Surface
import androidx.compose.material3.Switch
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.example.R
import com.example.ui.components.AvatarPickerRow
import com.example.ui.components.LearnerAvatarBadge
import com.example.ui.theme.CoralError
import com.example.ui.theme.LeafSecondary
import com.example.ui.theme.SkyPrimary
import com.example.ui.theme.SunGold
import com.example.ui.theme.VioletAccent
import com.example.ui.viewmodel.AppUiState

@Composable
fun ProgressScreen(
  uiState: AppUiState,
  onUpdateProfile: (String, Int, Int) -> Unit,
  onOpenLearnerSwitcher: () -> Unit,
  onOpenAddLearner: () -> Unit,
  onToggleTtsAutoRead: (Boolean) -> Unit,
  onResetProgress: () -> Unit,
  modifier: Modifier = Modifier,
) {
  var showEditDialog by remember { mutableStateOf(false) }
  var showResetDialog by remember { mutableStateOf(false) }

  val accuracy = if (uiState.stats.totalAnswered > 0) {
    ((uiState.stats.totalCorrect * 100f) / uiState.stats.totalAnswered).toInt()
  } else 0

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
      // Learner Profile & Multi-Learner Switcher Card
      item {
        Surface(
          shape = RoundedCornerShape(24.dp),
          color = MaterialTheme.colorScheme.surface,
          border = BorderStroke(1.5.dp, SkyPrimary.copy(alpha = 0.3f)),
          modifier = Modifier.fillMaxWidth(),
        ) {
          Column(
            modifier = Modifier.padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp),
          ) {
            Row(
              verticalAlignment = Alignment.CenterVertically,
            ) {
              LearnerAvatarBadge(
                avatarIndex = uiState.stats.avatarIndex,
                size = 64.dp,
                contentDescription = "${uiState.stats.learnerName} Avatar",
              )
              Spacer(Modifier.width(14.dp))
              Column(modifier = Modifier.weight(1f)) {
                Text(uiState.stats.learnerName, style = MaterialTheme.typography.titleLarge)
                Text(
                  text = "Grade ${uiState.stats.selectedGrade} • ${uiState.stats.totalXp} Science XP",
                  style = MaterialTheme.typography.bodyMedium,
                  color = MaterialTheme.colorScheme.primary,
                  fontWeight = FontWeight.SemiBold,
                )
              }
              IconButton(
                onClick = { showEditDialog = true },
                modifier = Modifier.testTag("edit_profile_button"),
              ) {
                Icon(Icons.Rounded.Edit, contentDescription = "Edit profile")
              }
            }

            Row(
              modifier = Modifier.fillMaxWidth(),
              horizontalArrangement = Arrangement.spacedBy(10.dp),
            ) {
              OutlinedButton(
                onClick = onOpenLearnerSwitcher,
                shape = RoundedCornerShape(14.dp),
                border = BorderStroke(1.dp, SkyPrimary.copy(alpha = 0.45f)),
                modifier = Modifier
                  .weight(1f)
                  .height(48.dp)
                  .testTag("progress_switch_learner_button"),
              ) {
                Icon(Icons.Rounded.Group, contentDescription = null, modifier = Modifier.size(18.dp))
                Spacer(Modifier.width(6.dp))
                Text("Switch (${uiState.learners.size})", fontWeight = FontWeight.SemiBold)
              }
              Button(
                onClick = onOpenAddLearner,
                colors = ButtonDefaults.buttonColors(
                  containerColor = SkyPrimary,
                  contentColor = Color.White,
                ),
                shape = RoundedCornerShape(14.dp),
                modifier = Modifier
                  .weight(1f)
                  .height(48.dp)
                  .testTag("progress_add_learner_button"),
              ) {
                Icon(Icons.Rounded.Add, contentDescription = null, modifier = Modifier.size(18.dp))
                Spacer(Modifier.width(6.dp))
                Text("Add Learner", fontWeight = FontWeight.SemiBold)
              }
            }
          }
        }
      }

      // Quick Metric Grid
      item {
        Row(
          modifier = Modifier.fillMaxWidth(),
          horizontalArrangement = Arrangement.spacedBy(10.dp),
        ) {
          MetricTile(
            label = "Mastery Stars",
            value = "${uiState.totalStars}/${uiState.maxStars}",
            icon = Icons.Rounded.Star,
            color = SunGold,
            modifier = Modifier.weight(1f),
          )
          MetricTile(
            label = "Lessons Done",
            value = "${uiState.completedLessonsCount}/${uiState.allLessons.size}",
            icon = Icons.Rounded.CheckCircle,
            color = LeafSecondary,
            modifier = Modifier.weight(1f),
          )
        }
      }
      item {
        Row(
          modifier = Modifier.fillMaxWidth(),
          horizontalArrangement = Arrangement.spacedBy(10.dp),
        ) {
          MetricTile(
            label = "Daily Streak",
            value = "${uiState.stats.currentStreak} days",
            icon = Icons.Rounded.LocalFireDepartment,
            color = CoralError,
            modifier = Modifier.weight(1f),
          )
          MetricTile(
            label = "Accuracy",
            value = "$accuracy%",
            icon = Icons.Rounded.EmojiEvents,
            color = VioletAccent,
            modifier = Modifier.weight(1f),
          )
        }
      }

      // Grade Progress Bars
      item {
        Surface(
          shape = RoundedCornerShape(22.dp),
          color = MaterialTheme.colorScheme.surface,
          border = BorderStroke(1.dp, MaterialTheme.colorScheme.outline.copy(alpha = 0.4f)),
          modifier = Modifier.fillMaxWidth(),
        ) {
          Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
            Text("Progress by Grade", style = MaterialTheme.typography.titleMedium)
            listOf(3, 4, 5, 6).forEach { grade ->
              val gLessons = uiState.allLessons.filter { it.grade == grade }
              val gStars = gLessons.sumOf { uiState.progressMap[it.id]?.stars ?: 0 }
              val gMax = (gLessons.size * 3).coerceAtLeast(1)
              val ratio = (gStars.toFloat() / gMax).coerceIn(0f, 1f)
              val barColor = when (grade) {
                3 -> LeafSecondary
                4 -> SkyPrimary
                5 -> VioletAccent
                else -> SunGold
              }
              Column(verticalArrangement = Arrangement.spacedBy(4.dp)) {
                Row(
                  modifier = Modifier.fillMaxWidth(),
                  horizontalArrangement = Arrangement.SpaceBetween,
                ) {
                  Text("Grade $grade Science", style = MaterialTheme.typography.labelLarge)
                  Text(
                    text = "$gStars / $gMax stars",
                    style = MaterialTheme.typography.labelMedium,
                    color = barColor,
                  )
                }
                LinearProgressIndicator(
                  progress = { ratio },
                  color = barColor,
                  trackColor = barColor.copy(alpha = 0.16f),
                  modifier = Modifier
                    .fillMaxWidth()
                    .height(8.dp)
                    .clip(RoundedCornerShape(50)),
                )
              }
            }
          }
        }
      }

      // Badges
      item {
        Text("Science Badges", style = MaterialTheme.typography.titleMedium)
      }
      items(uiState.badges.size) { idx ->
        val badge = uiState.badges[idx]
        Surface(
          shape = RoundedCornerShape(18.dp),
          color = MaterialTheme.colorScheme.surface,
          border = BorderStroke(
            1.2.dp,
            if (badge.unlocked) SunGold else MaterialTheme.colorScheme.outline.copy(alpha = 0.35f),
          ),
          modifier = Modifier.fillMaxWidth(),
        ) {
          Row(
            modifier = Modifier.padding(14.dp),
            verticalAlignment = Alignment.CenterVertically,
          ) {
            Surface(
              shape = CircleShape,
              color = if (badge.unlocked) SunGold.copy(alpha = 0.18f) else MaterialTheme.colorScheme.surfaceVariant,
              modifier = Modifier.size(46.dp),
            ) {
              Box(contentAlignment = Alignment.Center) {
                Icon(
                  imageVector = if (badge.unlocked) Icons.Rounded.EmojiEvents else Icons.Rounded.Lock,
                  contentDescription = null,
                  tint = if (badge.unlocked) SunGold else MaterialTheme.colorScheme.onSurfaceVariant,
                )
              }
            }
            Spacer(Modifier.width(12.dp))
            Column(modifier = Modifier.weight(1f)) {
              Text(badge.title, style = MaterialTheme.typography.titleSmall)
              Text(
                badge.description,
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
              )
            }
            Text(
              text = badge.progressText,
              style = MaterialTheme.typography.labelSmall,
              color = if (badge.unlocked) LeafSecondary else MaterialTheme.colorScheme.onSurfaceVariant,
              fontWeight = FontWeight.Bold,
            )
          }
        }
      }

      // Settings Card
      item {
        Surface(
          shape = RoundedCornerShape(22.dp),
          color = MaterialTheme.colorScheme.surface,
          border = BorderStroke(1.dp, MaterialTheme.colorScheme.outline.copy(alpha = 0.4f)),
          modifier = Modifier.fillMaxWidth(),
        ) {
          Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
            Text("Learning Preferences", style = MaterialTheme.typography.titleMedium)
            Row(
              modifier = Modifier.fillMaxWidth(),
              verticalAlignment = Alignment.CenterVertically,
              horizontalArrangement = Arrangement.SpaceBetween,
            ) {
              Row(verticalAlignment = Alignment.CenterVertically, modifier = Modifier.weight(1f)) {
                Icon(Icons.Rounded.RecordVoiceOver, contentDescription = null, tint = SkyPrimary)
                Spacer(Modifier.width(12.dp))
                Column {
                  Text("Auto Read Aloud", style = MaterialTheme.typography.bodyLarge)
                  Text(
                    "Speak each question automatically",
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                  )
                }
              }
              Switch(
                checked = uiState.stats.ttsAutoRead,
                onCheckedChange = onToggleTtsAutoRead,
                modifier = Modifier.testTag("auto_tts_switch"),
              )
            }
            OutlinedButton(
              onClick = { showResetDialog = true },
              colors = ButtonDefaults.outlinedButtonColors(contentColor = CoralError),
              border = BorderStroke(1.dp, CoralError.copy(alpha = 0.5f)),
              modifier = Modifier
                .fillMaxWidth()
                .testTag("reset_progress_button"),
            ) {
              Icon(Icons.Rounded.RestartAlt, contentDescription = null)
              Spacer(Modifier.width(8.dp))
              Text("Reset Learning Progress")
            }
          }
        }
      }

      // App Attribution Card
      item {
        Surface(
          shape = RoundedCornerShape(20.dp),
          color = MaterialTheme.colorScheme.primaryContainer.copy(alpha = 0.4f),
          border = BorderStroke(1.dp, SkyPrimary.copy(alpha = 0.3f)),
          modifier = Modifier
            .fillMaxWidth()
            .testTag("app_attribution_card"),
        ) {
          Row(
            modifier = Modifier.padding(14.dp),
            verticalAlignment = Alignment.CenterVertically,
          ) {
            Image(
              painter = painterResource(id = R.drawable.ic_launcher_art),
              contentDescription = "SCIENTISTS of Bagacay ES Logo",
              contentScale = ContentScale.Crop,
              modifier = Modifier
                .size(44.dp)
                .clip(RoundedCornerShape(12.dp)),
            )
            Spacer(Modifier.width(12.dp))
            Column {
              Text(
                text = "SCIENTISTS of Bagacay ES",
                style = MaterialTheme.typography.titleSmall,
                color = MaterialTheme.colorScheme.onSurface,
              )
              Text(
                text = "This is innovated by FRANZ D. PADOJINOG",
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
              )
            }
          }
        }
      }

      item { Spacer(Modifier.height(12.dp)) }
    }
  }

  if (showEditDialog) {
    var nameDraft by remember(uiState.stats.id) { mutableStateOf(uiState.stats.learnerName) }
    var gradeDraft by remember(uiState.stats.id) { mutableIntStateOf(uiState.stats.selectedGrade) }
    var avatarDraft by remember(uiState.stats.id) { mutableIntStateOf(uiState.stats.avatarIndex) }
    AlertDialog(
      onDismissRequest = { showEditDialog = false },
      title = { Text("Edit Learner Profile") },
      text = {
        Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
          OutlinedTextField(
            value = nameDraft,
            onValueChange = { nameDraft = it },
            label = { Text("Learner Name") },
            singleLine = true,
            modifier = Modifier.fillMaxWidth(),
          )
          Text("Choose Avatar", style = MaterialTheme.typography.labelLarge)
          AvatarPickerRow(
            selectedIndex = avatarDraft,
            onSelect = { avatarDraft = it },
          )
          Text("Default Grade Level", style = MaterialTheme.typography.labelLarge)
          Row(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
            listOf(3, 4, 5, 6).forEach { g ->
              Surface(
                onClick = { gradeDraft = g },
                shape = RoundedCornerShape(10.dp),
                color = if (gradeDraft == g) SkyPrimary else MaterialTheme.colorScheme.surfaceVariant,
                modifier = Modifier.weight(1f).height(48.dp),
              ) {
                Box(contentAlignment = Alignment.Center) {
                  Text(
                    text = "G$g",
                    color = if (gradeDraft == g) Color.White else MaterialTheme.colorScheme.onSurface,
                    fontWeight = FontWeight.Bold,
                  )
                }
              }
            }
          }
        }
      },
      confirmButton = {
        Button(onClick = {
          onUpdateProfile(nameDraft, gradeDraft, avatarDraft)
          showEditDialog = false
        }) {
          Text("Save")
        }
      },
      dismissButton = {
        TextButton(onClick = { showEditDialog = false }) { Text("Cancel") }
      },
    )
  }

  if (showResetDialog) {
    AlertDialog(
      onDismissRequest = { showResetDialog = false },
      title = { Text("Reset ${uiState.stats.learnerName}'s Progress?") },
      text = {
        Text(
          "This clears ${uiState.stats.learnerName}'s stars, XP, streaks, and missed question history on this device. Other learners' records are kept."
        )
      },
      confirmButton = {
        Button(
          onClick = {
            onResetProgress()
            showResetDialog = false
          },
          colors = ButtonDefaults.buttonColors(containerColor = CoralError),
        ) {
          Text("Reset")
        }
      },
      dismissButton = {
        TextButton(onClick = { showResetDialog = false }) { Text("Cancel") }
      },
    )
  }
}

@Composable
private fun MetricTile(
  label: String,
  value: String,
  icon: androidx.compose.ui.graphics.vector.ImageVector,
  color: Color,
  modifier: Modifier = Modifier,
) {
  Surface(
    shape = RoundedCornerShape(20.dp),
    color = MaterialTheme.colorScheme.surface,
    border = BorderStroke(1.dp, MaterialTheme.colorScheme.outline.copy(alpha = 0.4f)),
    modifier = modifier,
  ) {
    Row(
      modifier = Modifier.padding(14.dp),
      verticalAlignment = Alignment.CenterVertically,
    ) {
      Surface(
        shape = RoundedCornerShape(12.dp),
        color = color.copy(alpha = 0.14f),
        modifier = Modifier.size(42.dp),
      ) {
        Box(contentAlignment = Alignment.Center) {
          Icon(icon, contentDescription = null, tint = color)
        }
      }
      Spacer(Modifier.width(10.dp))
      Column {
        Text(value, style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)
        Text(label, style = MaterialTheme.typography.labelSmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
      }
    }
  }
}
