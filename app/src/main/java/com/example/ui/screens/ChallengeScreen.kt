package com.example.ui.screens

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
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
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.rounded.ArrowForward
import androidx.compose.material.icons.rounded.Bolt
import androidx.compose.material.icons.rounded.Category
import androidx.compose.material.icons.rounded.Explore
import androidx.compose.material.icons.rounded.Group
import androidx.compose.material.icons.rounded.HistoryEdu
import androidx.compose.material.icons.rounded.PlayArrow
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.minimumInteractiveComponentSize
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.example.R
import com.example.data.model.ChallengeMode
import com.example.ui.components.LearnerAvatarBadge
import com.example.ui.theme.CoralError
import com.example.ui.theme.LeafSecondary
import com.example.ui.theme.SkyPrimary
import com.example.ui.theme.SunGold
import com.example.ui.theme.VioletAccent
import com.example.ui.viewmodel.AppUiState

@Composable
fun ChallengeScreen(
  uiState: AppUiState,
  onStartChallenge: (ChallengeMode) -> Unit,
  onOpenLearnerSwitcher: () -> Unit,
  modifier: Modifier = Modifier,
) {
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
      item {
        Row(
          modifier = Modifier.fillMaxWidth(),
          horizontalArrangement = Arrangement.SpaceBetween,
          verticalAlignment = Alignment.CenterVertically,
        ) {
          Column(modifier = Modifier.weight(1f)) {
            Text("Science Arcade & Challenges", style = MaterialTheme.typography.headlineMedium)
            Text(
              text = "Sharpen your Grade ${uiState.selectedGrade} skills with interactive sprints and lab modes.",
              style = MaterialTheme.typography.bodyMedium,
              color = MaterialTheme.colorScheme.onSurfaceVariant,
            )
          }
          Spacer(Modifier.width(8.dp))
          Surface(
            onClick = onOpenLearnerSwitcher,
            shape = RoundedCornerShape(50),
            color = SkyPrimary.copy(alpha = 0.12f),
            border = BorderStroke(1.dp, SkyPrimary.copy(alpha = 0.3f)),
            modifier = Modifier
              .minimumInteractiveComponentSize()
              .testTag("challenge_switch_learner_button"),
          ) {
            Row(
              modifier = Modifier.padding(horizontal = 10.dp, vertical = 6.dp),
              verticalAlignment = Alignment.CenterVertically,
            ) {
              LearnerAvatarBadge(
                avatarIndex = uiState.stats.avatarIndex,
                size = 24.dp,
                contentDescription = uiState.stats.learnerName,
              )
              Spacer(Modifier.width(6.dp))
              Text(
                text = uiState.stats.learnerName,
                style = MaterialTheme.typography.labelMedium,
                color = SkyPrimary,
                fontWeight = FontWeight.Bold,
              )
              Spacer(Modifier.width(4.dp))
              Icon(
                imageVector = Icons.Rounded.Group,
                contentDescription = "Switch learner",
                tint = SkyPrimary,
                modifier = Modifier.size(16.dp),
              )
            }
          }
        }
      }

      // Daily Science Sprint Banner Card
      item {
        Surface(
          shape = RoundedCornerShape(24.dp),
          shadowElevation = 4.dp,
          modifier = Modifier
            .fillMaxWidth()
            .testTag("daily_sprint_card"),
        ) {
          Box(
            modifier = Modifier
              .fillMaxWidth()
              .height(185.dp)
          ) {
            Image(
              painter = painterResource(id = R.drawable.img_lab_challenge),
              contentDescription = "Science Challenge Arena",
              contentScale = ContentScale.Crop,
              modifier = Modifier.fillMaxSize(),
            )
            Box(
              modifier = Modifier
                .fillMaxSize()
                .background(
                  Brush.verticalGradient(
                    colors = listOf(
                      Color(0xFF1E1B4B).copy(alpha = 0.35f),
                      Color(0xFF1E1B4B).copy(alpha = 0.90f),
                    )
                  )
                )
            )
            Column(
              modifier = Modifier
                .fillMaxSize()
                .padding(18.dp),
              verticalArrangement = Arrangement.Bottom,
            ) {
              Text(
                text = ChallengeMode.DAILY_MIX.title,
                style = MaterialTheme.typography.headlineSmall,
                color = Color.White,
              )
              Text(
                text = "10 mixed questions across Grade ${uiState.selectedGrade} topics",
                style = MaterialTheme.typography.bodySmall,
                color = Color.White.copy(alpha = 0.9f),
              )
              Spacer(Modifier.height(10.dp))
              Button(
                onClick = { onStartChallenge(ChallengeMode.DAILY_MIX) },
                colors = ButtonDefaults.buttonColors(
                  containerColor = SunGold,
                  contentColor = Color(0xFF422006),
                ),
                shape = RoundedCornerShape(14.dp),
                modifier = Modifier.testTag("start_daily_sprint_button"),
              ) {
                Icon(Icons.Rounded.PlayArrow, contentDescription = null)
                Spacer(Modifier.width(6.dp))
                Text("Play Daily Sprint", fontWeight = FontWeight.Bold)
              }
            }
          }
        }
      }

      item {
        Text("Practice by Activity Mode", style = MaterialTheme.typography.titleMedium)
      }

      item {
        ChallengeModeCard(
          mode = ChallengeMode.QUICK_QUIZ,
          icon = Icons.Rounded.Bolt,
          accent = SkyPrimary,
          badge = "10 Questions",
          onClick = { onStartChallenge(ChallengeMode.QUICK_QUIZ) },
        )
      }

      item {
        ChallengeModeCard(
          mode = ChallengeMode.SORT_AND_MATCH,
          icon = Icons.Rounded.Category,
          accent = LeafSecondary,
          badge = "Hands-On Lab",
          onClick = { onStartChallenge(ChallengeMode.SORT_AND_MATCH) },
        )
      }

      item {
        ChallengeModeCard(
          mode = ChallengeMode.VISUAL_SPOTTER,
          icon = Icons.Rounded.Explore,
          accent = VioletAccent,
          badge = "Diagrams & Sims",
          onClick = { onStartChallenge(ChallengeMode.VISUAL_SPOTTER) },
        )
      }

      item {
        val mistakeCount = uiState.mistakes.size
        ChallengeModeCard(
          mode = ChallengeMode.MISTAKE_REVIEW,
          icon = Icons.Rounded.HistoryEdu,
          accent = CoralError,
          badge = if (mistakeCount == 0) "All Clear!" else "$mistakeCount to review",
          enabled = mistakeCount > 0,
          onClick = { onStartChallenge(ChallengeMode.MISTAKE_REVIEW) },
        )
      }

      item { Spacer(Modifier.height(12.dp)) }
    }
  }
}

@Composable
private fun ChallengeModeCard(
  mode: ChallengeMode,
  icon: ImageVector,
  accent: Color,
  badge: String,
  enabled: Boolean = true,
  onClick: () -> Unit,
) {
  Surface(
    onClick = { if (enabled) onClick() },
    shape = RoundedCornerShape(20.dp),
    color = MaterialTheme.colorScheme.surface,
    border = BorderStroke(
      1.2.dp,
      if (enabled) accent.copy(alpha = 0.35f) else MaterialTheme.colorScheme.outline.copy(alpha = 0.3f),
    ),
    modifier = Modifier
      .fillMaxWidth()
      .testTag("challenge_mode_${mode.name}"),
  ) {
    Row(
      modifier = Modifier.padding(16.dp),
      verticalAlignment = Alignment.CenterVertically,
    ) {
      Surface(
        color = accent.copy(alpha = if (enabled) 0.14f else 0.08f),
        shape = RoundedCornerShape(16.dp),
        modifier = Modifier.size(54.dp),
      ) {
        Box(contentAlignment = Alignment.Center) {
          Icon(
            icon,
            contentDescription = null,
            tint = if (enabled) accent else MaterialTheme.colorScheme.outline,
            modifier = Modifier.size(28.dp),
          )
        }
      }
      Spacer(Modifier.width(14.dp))
      Column(modifier = Modifier.weight(1f)) {
        Row(verticalAlignment = Alignment.CenterVertically) {
          Text(
            text = mode.title,
            style = MaterialTheme.typography.titleMedium,
            color = if (enabled) MaterialTheme.colorScheme.onSurface else MaterialTheme.colorScheme.onSurfaceVariant,
          )
        }
        Spacer(Modifier.height(2.dp))
        Text(
          text = mode.subtitle,
          style = MaterialTheme.typography.bodySmall,
          color = MaterialTheme.colorScheme.onSurfaceVariant,
        )
        Spacer(Modifier.height(6.dp))
        Surface(
          color = accent.copy(alpha = 0.12f),
          shape = RoundedCornerShape(50),
        ) {
          Text(
            text = badge,
            style = MaterialTheme.typography.labelSmall,
            color = accent,
            fontWeight = FontWeight.Bold,
            modifier = Modifier.padding(horizontal = 8.dp, vertical = 3.dp),
          )
        }
      }
      if (enabled) {
        Icon(
          Icons.AutoMirrored.Rounded.ArrowForward,
          contentDescription = null,
          tint = accent,
        )
      }
    }
  }
}
