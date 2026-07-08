$data = [Console]::In.ReadToEnd() | ConvertFrom-Json

if ($data.tool_input.file_path -match 'glossary\.js$') {
  @{
    hookSpecificOutput = @{
      hookEventName = 'PreToolUse'
      permissionDecision = 'ask'
      permissionDecisionReason = 'glossary.js holds the astrophysics glossary definitions surfaced throughout the sim — confirm this edit keeps definitions accurate and consistent with core.js/panels.js.'
    }
  } | ConvertTo-Json -Depth 10
  exit 0
}

exit 0
