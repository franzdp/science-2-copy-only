package com.example.ui.components

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ExperimentalLayoutApi
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.rounded.ArrowDownward
import androidx.compose.material.icons.rounded.ArrowUpward
import androidx.compose.material.icons.rounded.Cancel
import androidx.compose.material.icons.rounded.CheckCircle
import androidx.compose.material.icons.rounded.Close
import androidx.compose.material.icons.rounded.TouchApp
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import com.example.data.model.QuestionType
import com.example.data.model.ScienceQuestion
import com.example.ui.theme.CoralError
import com.example.ui.theme.LeafSecondary
import com.example.ui.theme.SkyPrimary
import com.example.ui.theme.SunGold
import com.example.ui.theme.VioletAccent
import com.example.ui.viewmodel.ActivitySessionState
import com.example.ui.viewmodel.MainViewModel

private val PairColors = listOf(SkyPrimary, LeafSecondary, SunGold, VioletAccent, CoralError)

@Composable
fun QuestionInteractionBody(
  question: ScienceQuestion,
  session: ActivitySessionState,
  viewModel: MainViewModel,
) {
  val isSubmitted = session.feedback != null
  when (question.type) {
    QuestionType.MULTIPLE_CHOICE -> MultipleChoiceBody(question, session, isSubmitted, viewModel::onSelectSingle)
    QuestionType.TRUE_FALSE -> TrueFalseBody(question, session, isSubmitted, viewModel::onSelectBool)
    QuestionType.MULTI_SELECT -> MultiSelectBody(question, session, isSubmitted, viewModel::onToggleMultiSelect)
    QuestionType.MATCHING -> MatchingBody(question, session, isSubmitted, viewModel)
    QuestionType.SORT_BUCKETS -> SortBucketsBody(question, session, isSubmitted, viewModel)
    QuestionType.ORDER_STEPS -> OrderStepsBody(question, session, isSubmitted, viewModel)
    QuestionType.HOTSPOT -> InteractiveHotspotScene(
      sceneTitle = question.sceneTitle,
      hotspots = question.hotspots,
      selectedIndices = session.selectedHotspotIndices,
      correctIndices = question.correctIndices.toSet(),
      isSubmitted = isSubmitted,
      onToggleHotspot = viewModel::onToggleHotspot,
    )
    QuestionType.SLIDER -> InteractiveRulerSlider(
      minValue = question.minValue,
      maxValue = question.maxValue,
      targetValue = question.targetValue,
      unit = question.unit,
      currentValue = session.sliderValue,
      isSubmitted = isSubmitted,
      onValueChange = viewModel::onSliderChange,
    )
    QuestionType.SIMULATION -> InteractiveScienceSimulation(
      simType = question.simType,
      choices = question.choices,
      selectedChoice = session.simSelectedChoice,
      correctIndex = question.correctIndex,
      isSubmitted = isSubmitted,
      simHasRun = session.simHasRun,
      onRunSimulation = viewModel::onSimulationRun,
      onSelectChoice = viewModel::onSelectSimulationChoice,
    )
    QuestionType.FILL_BLANK -> FillBlankBody(question, session, isSubmitted, viewModel::onToggleFillBlankChoice)
  }
}

@Composable
private fun MultipleChoiceBody(
  q: ScienceQuestion,
  s: ActivitySessionState,
  isSubmitted: Boolean,
  onSelect: (Int) -> Unit,
) {
  val letters = listOf("A", "B", "C", "D")
  Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
    q.options.forEachIndexed { idx, opt ->
      val selected = s.selectedSingleIndex == idx
      val correct = idx == q.correctIndex
      val borderColor = when {
        isSubmitted && correct -> LeafSecondary
        isSubmitted && selected && !correct -> CoralError
        selected -> SkyPrimary
        else -> MaterialTheme.colorScheme.outline.copy(alpha = 0.55f)
      }
      val bg = when {
        isSubmitted && correct -> LeafSecondary.copy(alpha = 0.13f)
        isSubmitted && selected && !correct -> CoralError.copy(alpha = 0.12f)
        selected -> SkyPrimary.copy(alpha = 0.12f)
        else -> MaterialTheme.colorScheme.surface
      }
      Surface(
        onClick = { if (!isSubmitted) onSelect(idx) },
        shape = RoundedCornerShape(18.dp),
        color = bg,
        border = BorderStroke(2.dp, borderColor),
        modifier = Modifier
          .fillMaxWidth()
          .testTag("mc_option_$idx"),
      ) {
        Row(
          modifier = Modifier.padding(14.dp),
          verticalAlignment = Alignment.CenterVertically,
        ) {
          Surface(
            shape = CircleShape,
            color = if (selected || (isSubmitted && correct)) borderColor else MaterialTheme.colorScheme.surfaceVariant,
            modifier = Modifier.size(34.dp),
          ) {
            Box(contentAlignment = Alignment.Center) {
              Text(
                text = letters.getOrElse(idx) { "${idx + 1}" },
                style = MaterialTheme.typography.labelLarge,
                color = if (selected || (isSubmitted && correct)) Color.White else MaterialTheme.colorScheme.onSurface,
              )
            }
          }
          Spacer(Modifier.width(12.dp))
          Text(
            text = opt,
            style = MaterialTheme.typography.bodyLarge,
            fontWeight = if (selected) FontWeight.SemiBold else FontWeight.Normal,
            modifier = Modifier.weight(1f),
          )
        }
      }
    }
  }
}

@Composable
private fun TrueFalseBody(
  q: ScienceQuestion,
  s: ActivitySessionState,
  isSubmitted: Boolean,
  onSelect: (Boolean) -> Unit,
) {
  Row(
    modifier = Modifier.fillMaxWidth(),
    horizontalArrangement = Arrangement.spacedBy(12.dp),
  ) {
    listOf(true to "True", false to "False").forEach { (valBool, label) ->
      val selected = s.selectedBool == valBool
      val correct = q.correctBool == valBool
      val accent = if (valBool) LeafSecondary else CoralError
      val borderColor = when {
        isSubmitted && correct -> LeafSecondary
        isSubmitted && selected && !correct -> CoralError
        selected -> accent
        else -> MaterialTheme.colorScheme.outline.copy(alpha = 0.55f)
      }
      val bg = when {
        isSubmitted && correct -> LeafSecondary.copy(alpha = 0.16f)
        isSubmitted && selected && !correct -> CoralError.copy(alpha = 0.14f)
        selected -> accent.copy(alpha = 0.14f)
        else -> MaterialTheme.colorScheme.surface
      }
      Surface(
        onClick = { if (!isSubmitted) onSelect(valBool) },
        shape = RoundedCornerShape(22.dp),
        color = bg,
        border = BorderStroke(2.dp, borderColor),
        modifier = Modifier
          .weight(1f)
          .height(128.dp)
          .testTag("tf_option_${label.lowercase()}"),
      ) {
        Column(
          horizontalAlignment = Alignment.CenterHorizontally,
          verticalArrangement = Arrangement.Center,
          modifier = Modifier.padding(12.dp),
        ) {
          Icon(
            imageVector = if (valBool) Icons.Rounded.CheckCircle else Icons.Rounded.Cancel,
            contentDescription = label,
            tint = if (selected || (isSubmitted && correct)) borderColor else accent.copy(alpha = 0.7f),
            modifier = Modifier.size(40.dp),
          )
          Spacer(Modifier.height(8.dp))
          Text(label, style = MaterialTheme.typography.titleLarge)
        }
      }
    }
  }
}

@Composable
private fun MultiSelectBody(
  q: ScienceQuestion,
  s: ActivitySessionState,
  isSubmitted: Boolean,
  onToggle: (Int) -> Unit,
) {
  Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
    Text(
      text = if (q.isPictureMode) "Tap all picture cards that match:" else "Tap all items that apply:",
      style = MaterialTheme.typography.labelLarge,
      color = MaterialTheme.colorScheme.primary,
    )
    q.items.chunked(2).forEachIndexed { rowIdx, rowItems ->
      Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.spacedBy(10.dp),
      ) {
        rowItems.forEachIndexed { colIdx, label ->
          val idx = rowIdx * 2 + colIdx
          val selected = idx in s.selectedMultiIndices
          val isCorrect = idx in q.correctIndices
          val borderColor = when {
            isSubmitted && isCorrect -> LeafSecondary
            isSubmitted && selected && !isCorrect -> CoralError
            selected -> SkyPrimary
            else -> MaterialTheme.colorScheme.outline.copy(alpha = 0.5f)
          }
          val bg = when {
            isSubmitted && isCorrect -> LeafSecondary.copy(alpha = 0.14f)
            isSubmitted && selected && !isCorrect -> CoralError.copy(alpha = 0.12f)
            selected -> SkyPrimary.copy(alpha = 0.12f)
            else -> MaterialTheme.colorScheme.surface
          }
          val (icon, tint) = resolveScienceVisual(label)
          Surface(
            onClick = { if (!isSubmitted) onToggle(idx) },
            shape = RoundedCornerShape(18.dp),
            color = bg,
            border = BorderStroke(2.dp, borderColor),
            modifier = Modifier
              .weight(1f)
              .testTag("multi_item_$idx"),
          ) {
            Column(
              modifier = Modifier.padding(14.dp),
              horizontalAlignment = Alignment.CenterHorizontally,
            ) {
              Surface(
                shape = CircleShape,
                color = tint.copy(alpha = 0.15f),
                modifier = Modifier.size(48.dp),
              ) {
                Box(contentAlignment = Alignment.Center) {
                  Icon(icon, contentDescription = label, tint = tint, modifier = Modifier.size(26.dp))
                }
              }
              Spacer(Modifier.height(8.dp))
              Text(
                text = label,
                style = MaterialTheme.typography.bodyMedium,
                fontWeight = FontWeight.SemiBold,
                textAlign = TextAlign.Center,
              )
              if (selected || (isSubmitted && isCorrect)) {
                Spacer(Modifier.height(6.dp))
                Icon(
                  Icons.Rounded.CheckCircle,
                  contentDescription = "Selected",
                  tint = borderColor,
                  modifier = Modifier.size(18.dp),
                )
              }
            }
          }
        }
        if (rowItems.size == 1) Spacer(Modifier.weight(1f))
      }
    }
  }
}

@Composable
private fun MatchingBody(
  q: ScienceQuestion,
  s: ActivitySessionState,
  isSubmitted: Boolean,
  viewModel: MainViewModel,
) {
  Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
    Text(
      text = "Tap an item on the left, then tap its match on the right:",
      style = MaterialTheme.typography.labelLarge,
      color = MaterialTheme.colorScheme.primary,
    )
    q.leftItems.indices.forEach { rowIdx ->
      val leftText = q.leftItems[rowIdx]
      val rightOrigIdx = s.shuffledRightIndices.getOrElse(rowIdx) { rowIdx }
      val rightText = q.rightItems.getOrElse(rightOrigIdx) { "" }

      val leftColorIdx = if (rowIdx in s.matchedPairs) rowIdx % PairColors.size else -1
      val rightOwnerLeftIdx = s.matchedPairs.entries.firstOrNull { it.value == rightOrigIdx }?.key
      val rightColorIdx = if (rightOwnerLeftIdx != null) rightOwnerLeftIdx % PairColors.size else -1

      val isLeftActive = s.activeLeftIndex == rowIdx

      Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.spacedBy(8.dp),
        verticalAlignment = Alignment.CenterVertically,
      ) {
        Surface(
          onClick = { if (!isSubmitted) viewModel.onSelectMatchingLeft(rowIdx) },
          shape = RoundedCornerShape(14.dp),
          color = when {
            isSubmitted && s.matchedPairs[rowIdx] == q.correctPairs[rowIdx] -> LeafSecondary.copy(alpha = 0.15f)
            isSubmitted -> CoralError.copy(alpha = 0.12f)
            isLeftActive -> SkyPrimary.copy(alpha = 0.18f)
            leftColorIdx >= 0 -> PairColors[leftColorIdx].copy(alpha = 0.14f)
            else -> MaterialTheme.colorScheme.surface
          },
          border = BorderStroke(
            2.dp,
            when {
              isLeftActive -> SkyPrimary
              leftColorIdx >= 0 -> PairColors[leftColorIdx]
              else -> MaterialTheme.colorScheme.outline.copy(alpha = 0.5f)
            },
          ),
          modifier = Modifier
            .weight(0.45f)
            .testTag("match_left_$rowIdx"),
        ) {
          Row(
            modifier = Modifier.padding(10.dp),
            verticalAlignment = Alignment.CenterVertically,
          ) {
            Surface(
              shape = CircleShape,
              color = if (leftColorIdx >= 0) PairColors[leftColorIdx] else MaterialTheme.colorScheme.surfaceVariant,
              modifier = Modifier.size(24.dp),
            ) {
              Box(contentAlignment = Alignment.Center) {
                Text(
                  text = "${rowIdx + 1}",
                  style = MaterialTheme.typography.labelSmall,
                  color = if (leftColorIdx >= 0) Color.White else MaterialTheme.colorScheme.onSurface,
                )
              }
            }
            Spacer(Modifier.width(8.dp))
            Text(leftText, style = MaterialTheme.typography.bodySmall, fontWeight = FontWeight.SemiBold)
          }
        }

        Surface(
          onClick = { if (!isSubmitted) viewModel.onSelectMatchingRight(rightOrigIdx) },
          shape = RoundedCornerShape(14.dp),
          color = if (rightColorIdx >= 0) PairColors[rightColorIdx].copy(alpha = 0.14f) else MaterialTheme.colorScheme.surface,
          border = BorderStroke(
            2.dp,
            if (rightColorIdx >= 0) PairColors[rightColorIdx] else MaterialTheme.colorScheme.outline.copy(alpha = 0.5f),
          ),
          modifier = Modifier
            .weight(0.55f)
            .testTag("match_right_$rowIdx"),
        ) {
          Row(
            modifier = Modifier.padding(10.dp),
            verticalAlignment = Alignment.CenterVertically,
          ) {
            if (rightOwnerLeftIdx != null) {
              Surface(
                shape = CircleShape,
                color = PairColors[rightColorIdx],
                modifier = Modifier.size(22.dp),
              ) {
                Box(contentAlignment = Alignment.Center) {
                  Text("${rightOwnerLeftIdx + 1}", style = MaterialTheme.typography.labelSmall, color = Color.White)
                }
              }
              Spacer(Modifier.width(6.dp))
            }
            Text(rightText, style = MaterialTheme.typography.bodySmall)
          }
        }
      }
    }
  }
}

@OptIn(ExperimentalLayoutApi::class)
@Composable
private fun SortBucketsBody(
  q: ScienceQuestion,
  s: ActivitySessionState,
  isSubmitted: Boolean,
  viewModel: MainViewModel,
) {
  Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
    Text(
      text = "Select a card below, then tap a bucket to place it:",
      style = MaterialTheme.typography.labelLarge,
      color = MaterialTheme.colorScheme.primary,
    )

    // Buckets
    q.buckets.forEachIndexed { bIdx, bName ->
      val cardsInBucket = s.cardBucketAssignments.entries
        .filter { it.value == bIdx }
        .map { it.key }
      val bucketColor = PairColors[bIdx % PairColors.size]
      Surface(
        onClick = { if (!isSubmitted) viewModel.onAssignCardToBucket(bIdx) },
        shape = RoundedCornerShape(18.dp),
        color = bucketColor.copy(alpha = 0.08f),
        border = BorderStroke(2.dp, bucketColor.copy(alpha = 0.55f)),
        modifier = Modifier
          .fillMaxWidth()
          .testTag("sort_bucket_$bIdx"),
      ) {
        Column(modifier = Modifier.padding(12.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
          Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically,
          ) {
            Text(bName, style = MaterialTheme.typography.titleSmall, color = bucketColor)
            if (!isSubmitted && s.activeCardIndex != null) {
              Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(Icons.Rounded.TouchApp, contentDescription = null, tint = bucketColor, modifier = Modifier.size(16.dp))
                Spacer(Modifier.width(4.dp))
                Text("Tap to drop", style = MaterialTheme.typography.labelSmall, color = bucketColor)
              }
            }
          }
          if (cardsInBucket.isNotEmpty()) {
            FlowRow(
              horizontalArrangement = Arrangement.spacedBy(6.dp),
              verticalArrangement = Arrangement.spacedBy(6.dp),
            ) {
              cardsInBucket.forEach { cardOrigIdx ->
                val card = q.cards[cardOrigIdx]
                val cardOk = card.bucketIndex == bIdx
                val chipColor = when {
                  isSubmitted && cardOk -> LeafSecondary
                  isSubmitted && !cardOk -> CoralError
                  else -> bucketColor
                }
                Surface(
                  onClick = { if (!isSubmitted) viewModel.onRemoveCardFromBucket(cardOrigIdx) },
                  shape = RoundedCornerShape(12.dp),
                  color = chipColor,
                ) {
                  Row(
                    modifier = Modifier.padding(horizontal = 10.dp, vertical = 6.dp),
                    verticalAlignment = Alignment.CenterVertically,
                  ) {
                    Text(card.text, style = MaterialTheme.typography.bodySmall, color = Color.White)
                    if (!isSubmitted) {
                      Spacer(Modifier.width(4.dp))
                      Icon(Icons.Rounded.Close, contentDescription = "Remove", tint = Color.White, modifier = Modifier.size(14.dp))
                    }
                  }
                }
              }
            }
          } else {
            Text(
              "No cards placed yet",
              style = MaterialTheme.typography.bodySmall,
              color = MaterialTheme.colorScheme.onSurfaceVariant,
            )
          }
        }
      }
    }

    // Remaining Cards Tray
    val unassigned = s.shuffledCardIndices.filter { it !in s.cardBucketAssignments }
    if (unassigned.isNotEmpty()) {
      Text("Cards to Sort:", style = MaterialTheme.typography.titleSmall)
      Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
        unassigned.forEach { cardIdx ->
          val active = s.activeCardIndex == cardIdx
          Surface(
            onClick = { if (!isSubmitted) viewModel.onSelectSortCard(cardIdx) },
            shape = RoundedCornerShape(14.dp),
            color = if (active) SkyPrimary.copy(alpha = 0.14f) else MaterialTheme.colorScheme.surface,
            border = BorderStroke(
              2.dp,
              if (active) SkyPrimary else MaterialTheme.colorScheme.outline.copy(alpha = 0.55f),
            ),
            modifier = Modifier
              .fillMaxWidth()
              .testTag("sort_card_$cardIdx"),
          ) {
            Text(
              text = q.cards[cardIdx].text,
              style = MaterialTheme.typography.bodyMedium,
              fontWeight = if (active) FontWeight.Bold else FontWeight.Medium,
              modifier = Modifier.padding(12.dp),
            )
          }
        }
      }
    }
  }
}

@Composable
private fun OrderStepsBody(
  q: ScienceQuestion,
  s: ActivitySessionState,
  isSubmitted: Boolean,
  viewModel: MainViewModel,
) {
  Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
    Text(
      text = "Use the arrows to arrange the steps in order (1 to ${q.steps.size}):",
      style = MaterialTheme.typography.labelLarge,
      color = MaterialTheme.colorScheme.primary,
    )
    s.orderedStepIndices.forEachIndexed { pos, origIdx ->
      val isRightPos = origIdx == pos
      val borderColor = when {
        isSubmitted && isRightPos -> LeafSecondary
        isSubmitted && !isRightPos -> CoralError
        else -> MaterialTheme.colorScheme.outline.copy(alpha = 0.5f)
      }
      Surface(
        shape = RoundedCornerShape(16.dp),
        color = MaterialTheme.colorScheme.surface,
        border = BorderStroke(1.8.dp, borderColor),
        modifier = Modifier.fillMaxWidth(),
      ) {
        Row(
          modifier = Modifier.padding(horizontal = 12.dp, vertical = 10.dp),
          verticalAlignment = Alignment.CenterVertically,
        ) {
          Surface(
            shape = CircleShape,
            color = SkyPrimary,
            modifier = Modifier.size(28.dp),
          ) {
            Box(contentAlignment = Alignment.Center) {
              Text("${pos + 1}", style = MaterialTheme.typography.labelMedium, color = Color.White)
            }
          }
          Spacer(Modifier.width(10.dp))
          Text(
            text = q.steps[origIdx],
            style = MaterialTheme.typography.bodyMedium,
            fontWeight = FontWeight.Medium,
            modifier = Modifier.weight(1f),
          )
          if (!isSubmitted) {
            IconButton(
              onClick = { viewModel.onMoveStepUp(pos) },
              enabled = pos > 0,
              modifier = Modifier.testTag("order_up_$pos"),
            ) {
              Icon(Icons.Rounded.ArrowUpward, contentDescription = "Move up")
            }
            IconButton(
              onClick = { viewModel.onMoveStepDown(pos) },
              enabled = pos < s.orderedStepIndices.lastIndex,
              modifier = Modifier.testTag("order_down_$pos"),
            ) {
              Icon(Icons.Rounded.ArrowDownward, contentDescription = "Move down")
            }
          }
        }
      }
    }
  }
}

@OptIn(ExperimentalLayoutApi::class)
@Composable
private fun FillBlankBody(
  q: ScienceQuestion,
  s: ActivitySessionState,
  isSubmitted: Boolean,
  onToggleChoice: (String) -> Unit,
) {
  Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
    Surface(
      shape = RoundedCornerShape(16.dp),
      color = MaterialTheme.colorScheme.primaryContainer.copy(alpha = 0.4f),
      modifier = Modifier.fillMaxWidth(),
    ) {
      Column(modifier = Modifier.padding(14.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
        Text("Selected word(s):", style = MaterialTheme.typography.labelLarge)
        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
          val needed = q.correctAnswers.size.coerceAtLeast(1)
          for (i in 0 until needed) {
            val chosen = s.fillBlankSelections.getOrNull(i)
            Surface(
              shape = RoundedCornerShape(10.dp),
              color = if (chosen != null) SkyPrimary else MaterialTheme.colorScheme.surface,
              border = BorderStroke(1.5.dp, SkyPrimary),
            ) {
              Text(
                text = chosen ?: "Blank ${i + 1}",
                style = MaterialTheme.typography.labelLarge,
                color = if (chosen != null) Color.White else MaterialTheme.colorScheme.onSurfaceVariant,
                modifier = Modifier.padding(horizontal = 12.dp, vertical = 6.dp),
              )
            }
          }
        }
      }
    }

    Text("Tap to fill in order:", style = MaterialTheme.typography.labelLarge)
    FlowRow(
      horizontalArrangement = Arrangement.spacedBy(8.dp),
      verticalArrangement = Arrangement.spacedBy(8.dp),
    ) {
      q.choices.forEachIndexed { idx, choice ->
        val selected = choice in s.fillBlankSelections
        Surface(
          onClick = { if (!isSubmitted) onToggleChoice(choice) },
          shape = RoundedCornerShape(14.dp),
          color = if (selected) SkyPrimary else MaterialTheme.colorScheme.surface,
          border = BorderStroke(1.5.dp, if (selected) SkyPrimary else MaterialTheme.colorScheme.outline),
          modifier = Modifier.testTag("fill_choice_$idx"),
        ) {
          Text(
            text = choice,
            style = MaterialTheme.typography.bodyMedium,
            color = if (selected) Color.White else MaterialTheme.colorScheme.onSurface,
            modifier = Modifier.padding(horizontal = 14.dp, vertical = 10.dp),
          )
        }
      }
    }
  }
}
