package com.example.ui.components

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.rounded.Add
import androidx.compose.material.icons.rounded.Bolt
import androidx.compose.material.icons.rounded.CheckCircle
import androidx.compose.material.icons.rounded.DeleteOutline
import androidx.compose.material.icons.rounded.Eco
import androidx.compose.material.icons.rounded.RocketLaunch
import androidx.compose.material.icons.rounded.Science
import androidx.compose.material.icons.rounded.WbSunny
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.material3.minimumInteractiveComponentSize
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
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import com.example.R
import com.example.data.local.LearnerStatsEntity
import com.example.ui.theme.CoralError
import com.example.ui.theme.LeafSecondary
import com.example.ui.theme.SkyPrimary
import com.example.ui.theme.SunGold
import com.example.ui.theme.VioletAccent

private data class AvatarSpec(
  val icon: ImageVector,
  val color: Color,
  val label: String,
)

private val AvatarSpecs = listOf(
  AvatarSpec(Icons.Rounded.Science, SkyPrimary, "Owl Scientist"),
  AvatarSpec(Icons.Rounded.Science, SkyPrimary, "Lab Chemist"),
  AvatarSpec(Icons.Rounded.Eco, LeafSecondary, "Botanist"),
  AvatarSpec(Icons.Rounded.RocketLaunch, VioletAccent, "Space Explorer"),
  AvatarSpec(Icons.Rounded.WbSunny, SunGold, "Solar Physicist"),
  AvatarSpec(Icons.Rounded.Bolt, CoralError, "Inventor"),
)

@Composable
fun LearnerAvatarBadge(
  avatarIndex: Int,
  size: Dp = 48.dp,
  modifier: Modifier = Modifier,
  contentDescription: String = "Learner avatar",
) {
  val idx = avatarIndex.coerceIn(0, AvatarSpecs.lastIndex)
  if (idx == 0) {
    Image(
      painter = painterResource(id = R.drawable.img_owl_scientist),
      contentDescription = contentDescription,
      contentScale = ContentScale.Crop,
      modifier = modifier
        .size(size)
        .clip(CircleShape),
    )
  } else {
    val spec = AvatarSpecs[idx]
    Surface(
      shape = CircleShape,
      color = spec.color.copy(alpha = 0.16f),
      border = BorderStroke(1.5.dp, spec.color.copy(alpha = 0.45f)),
      modifier = modifier.size(size),
    ) {
      Box(contentAlignment = Alignment.Center) {
        Icon(
          imageVector = spec.icon,
          contentDescription = contentDescription,
          tint = spec.color,
          modifier = Modifier.size(size * 0.56f),
        )
      }
    }
  }
}

@Composable
fun AvatarPickerRow(
  selectedIndex: Int,
  onSelect: (Int) -> Unit,
  modifier: Modifier = Modifier,
) {
  Row(
    modifier = modifier.fillMaxWidth(),
    horizontalArrangement = Arrangement.SpaceBetween,
    verticalAlignment = Alignment.CenterVertically,
  ) {
    AvatarSpecs.indices.forEach { idx ->
      val selected = idx == selectedIndex
      Surface(
        shape = CircleShape,
        color = Color.Transparent,
        border = if (selected) BorderStroke(2.5.dp, SkyPrimary) else null,
        modifier = Modifier
          .minimumInteractiveComponentSize()
          .clip(CircleShape)
          .clickable { onSelect(idx) }
          .padding(3.dp)
          .testTag("avatar_option_$idx"),
      ) {
        LearnerAvatarBadge(
          avatarIndex = idx,
          size = 40.dp,
          contentDescription = AvatarSpecs[idx].label,
        )
      }
    }
  }
}

@Composable
fun LearnerSwitcherDialog(
  learners: List<LearnerStatsEntity>,
  activeLearnerId: Long,
  learnerStarsMap: Map<Long, Int>,
  onSwitchLearner: (Long) -> Unit,
  onOpenAddLearner: () -> Unit,
  onDeleteLearner: (Long) -> Unit,
  onDismiss: () -> Unit,
) {
  var pendingDelete by remember { mutableStateOf<LearnerStatsEntity?>(null) }

  AlertDialog(
    onDismissRequest = onDismiss,
    title = {
      Column {
        Text("Switch Learner", style = MaterialTheme.typography.headlineSmall)
        Spacer(Modifier.height(2.dp))
        Text(
          text = "Each learner keeps separate stars, XP, badges, and missed items.",
          style = MaterialTheme.typography.bodySmall,
          color = MaterialTheme.colorScheme.onSurfaceVariant,
        )
      }
    },
    text = {
      Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
        LazyColumn(
          modifier = Modifier
            .fillMaxWidth()
            .heightIn(max = 310.dp),
          verticalArrangement = Arrangement.spacedBy(8.dp),
        ) {
          items(learners, key = { it.id }) { learner ->
            val isActive = learner.id == activeLearnerId
            val stars = learnerStarsMap[learner.id] ?: 0
            Surface(
              onClick = {
                onSwitchLearner(learner.id)
                onDismiss()
              },
              shape = RoundedCornerShape(16.dp),
              color = if (isActive) {
                SkyPrimary.copy(alpha = 0.10f)
              } else {
                MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.45f)
              },
              border = BorderStroke(
                width = if (isActive) 1.8.dp else 1.dp,
                color = if (isActive) SkyPrimary else MaterialTheme.colorScheme.outline.copy(alpha = 0.35f),
              ),
              modifier = Modifier
                .fillMaxWidth()
                .testTag("learner_row_${learner.id}"),
            ) {
              Row(
                modifier = Modifier.padding(horizontal = 12.dp, vertical = 10.dp),
                verticalAlignment = Alignment.CenterVertically,
              ) {
                LearnerAvatarBadge(
                  avatarIndex = learner.avatarIndex,
                  size = 44.dp,
                  contentDescription = learner.learnerName,
                )
                Spacer(Modifier.width(12.dp))
                Column(modifier = Modifier.weight(1f)) {
                  Text(
                    text = learner.learnerName,
                    style = MaterialTheme.typography.titleSmall,
                    fontWeight = FontWeight.Bold,
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis,
                  )
                  Text(
                    text = "Grade ${learner.selectedGrade} • ${learner.totalXp} XP • $stars ★",
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                  )
                }
                if (isActive) {
                  Surface(
                    shape = RoundedCornerShape(50),
                    color = LeafSecondary.copy(alpha = 0.16f),
                  ) {
                    Row(
                      modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
                      verticalAlignment = Alignment.CenterVertically,
                    ) {
                      Icon(
                        imageVector = Icons.Rounded.CheckCircle,
                        contentDescription = "Active learner",
                        tint = LeafSecondary,
                        modifier = Modifier.size(16.dp),
                      )
                      Spacer(Modifier.width(4.dp))
                      Text(
                        text = "Active",
                        style = MaterialTheme.typography.labelSmall,
                        color = LeafSecondary,
                        fontWeight = FontWeight.Bold,
                      )
                    }
                  }
                }
                if (learners.size > 1) {
                  IconButton(
                    onClick = { pendingDelete = learner },
                    modifier = Modifier.testTag("delete_learner_${learner.id}"),
                  ) {
                    Icon(
                      imageVector = Icons.Rounded.DeleteOutline,
                      contentDescription = "Remove ${learner.learnerName}",
                      tint = CoralError.copy(alpha = 0.8f),
                    )
                  }
                }
              }
            }
          }
        }

        Button(
          onClick = {
            onDismiss()
            onOpenAddLearner()
          },
          colors = ButtonDefaults.buttonColors(
            containerColor = SkyPrimary,
            contentColor = Color.White,
          ),
          shape = RoundedCornerShape(14.dp),
          modifier = Modifier
            .fillMaxWidth()
            .height(48.dp)
            .testTag("open_add_learner_button"),
        ) {
          Icon(Icons.Rounded.Add, contentDescription = null)
          Spacer(Modifier.width(6.dp))
          Text("Add New Learner", fontWeight = FontWeight.Bold)
        }
      }
    },
    confirmButton = {
      TextButton(onClick = onDismiss) {
        Text("Close")
      }
    },
  )

  val targetToDelete = pendingDelete
  if (targetToDelete != null) {
    AlertDialog(
      onDismissRequest = { pendingDelete = null },
      title = { Text("Remove ${targetToDelete.learnerName}?") },
      text = {
        Text(
          "This removes ${targetToDelete.learnerName}'s saved stars, XP, and missed questions from this device."
        )
      },
      confirmButton = {
        Button(
          onClick = {
            onDeleteLearner(targetToDelete.id)
            pendingDelete = null
          },
          colors = ButtonDefaults.buttonColors(containerColor = CoralError),
        ) {
          Text("Remove")
        }
      },
      dismissButton = {
        TextButton(onClick = { pendingDelete = null }) {
          Text("Cancel")
        }
      },
    )
  }
}

@Composable
fun AddLearnerDialog(
  suggestedNumber: Int,
  onCreateLearner: (name: String, grade: Int, avatarIndex: Int) -> Unit,
  onDismiss: () -> Unit,
) {
  var nameDraft by remember { mutableStateOf("") }
  var gradeDraft by remember { mutableIntStateOf(5) }
  var avatarDraft by remember { mutableIntStateOf((suggestedNumber - 1).coerceAtLeast(1) % AvatarSpecs.size) }

  AlertDialog(
    onDismissRequest = onDismiss,
    title = { Text("Add New Learner") },
    text = {
      Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
        OutlinedTextField(
          value = nameDraft,
          onValueChange = { nameDraft = it },
          label = { Text("Learner Name") },
          placeholder = { Text("Scientist $suggestedNumber") },
          singleLine = true,
          modifier = Modifier
            .fillMaxWidth()
            .testTag("new_learner_name_input"),
        )

        Text("Choose Avatar", style = MaterialTheme.typography.labelLarge)
        AvatarPickerRow(
          selectedIndex = avatarDraft,
          onSelect = { avatarDraft = it },
        )

        Text("Grade Level", style = MaterialTheme.typography.labelLarge)
        Row(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
          listOf(3, 4, 5, 6).forEach { g ->
            val selected = gradeDraft == g
            Surface(
              onClick = { gradeDraft = g },
              shape = RoundedCornerShape(10.dp),
              color = if (selected) SkyPrimary else MaterialTheme.colorScheme.surfaceVariant,
              modifier = Modifier
                .weight(1f)
                .height(48.dp)
                .testTag("add_learner_grade_$g"),
            ) {
              Box(contentAlignment = Alignment.Center) {
                Text(
                  text = "G$g",
                  color = if (selected) Color.White else MaterialTheme.colorScheme.onSurface,
                  fontWeight = FontWeight.Bold,
                )
              }
            }
          }
        }
      }
    },
    confirmButton = {
      Button(
        onClick = {
          val finalName = nameDraft.trim().ifBlank { "Scientist $suggestedNumber" }
          onCreateLearner(finalName, gradeDraft, avatarDraft)
          onDismiss()
        },
        modifier = Modifier.testTag("confirm_add_learner_button"),
      ) {
        Text("Create & Switch")
      }
    },
    dismissButton = {
      TextButton(onClick = onDismiss) {
        Text("Cancel")
      }
    },
  )
}
