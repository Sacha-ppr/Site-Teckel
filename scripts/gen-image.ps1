<#
.SYNOPSIS
  Generate an image with Google Gemini (Nano Banana) and save it to a file.
.EXAMPLE
  ./scripts/gen-image.ps1 -Prompt "..." -Out public/img/hero.png -Aspect 16:9
  ./scripts/gen-image.ps1 -Prompt "..." -Out public/img/dog.png -Aspect 1:1 -Model flash
#>
param(
  [Parameter(Mandatory = $true)][string]$Prompt,
  [Parameter(Mandatory = $true)][string]$Out,
  [ValidateSet("1:1", "16:9", "9:16", "4:3", "3:4", "3:2", "2:3")][string]$Aspect = "16:9",
  [ValidateSet("pro", "flash")][string]$Model = "pro",
  [string]$RefImage = ""
)

$ErrorActionPreference = "Stop"

$cred = (opencode auth export 2>$null | Out-String) | ConvertFrom-Json |
  Where-Object { $_.integrationID -eq "google" } | Select-Object -First 1
if (-not $cred) { throw "No Google credential found (opencode auth login google)" }
$key = $cred.value.key

$map = @{
  pro   = "gemini-3-pro-image"
  flash = "gemini-3.1-flash-image"
}
$modelId = $map[$Model]

$parts = @()
if ($RefImage) {
  $abs = (Resolve-Path $RefImage).Path
  $bytes = [System.IO.File]::ReadAllBytes($abs)
  $b64 = [Convert]::ToBase64String($bytes)
  $mime = switch -Regex ($abs) { '\.png$' { 'image/png' } '\.jpe?g$' { 'image/jpeg' } '\.webp$' { 'image/webp' } default { 'image/png' } }
  $parts += @{ inlineData = @{ mimeType = $mime; data = $b64 } }
}
$parts += @{ text = $Prompt }

$body = @{
  contents          = @(@{ role = "user"; parts = $parts })
  generationConfig  = @{
    responseModalities = @("IMAGE")
    imageConfig        = @{ aspectRatio = $Aspect }
  }
} | ConvertTo-Json -Depth 8

$uri = "https://generativelanguage.googleapis.com/v1beta/models/${modelId}:generateContent"
$res = Invoke-RestMethod -Uri $uri -Method Post -Headers @{ "x-goog-api-key" = $key } `
  -ContentType "application/json" -Body ([System.Text.Encoding]::UTF8.GetBytes($body)) -TimeoutSec 180

$cand = $res.candidates | Select-Object -First 1
$img = $null
foreach ($p in $cand.content.parts) {
  if ($p.inlineData) { $img = $p.inlineData; break }
  if ($p.inline_data) { $img = $p.inline_data; break }
}
if (-not $img) {
  $txt = ($cand.content.parts | ForEach-Object { $_.text }) -join " "
  throw "No image returned (finishReason=$($cand.finishReason)): $txt"
}

$dir = Split-Path -Parent $Out
if ($dir -and -not (Test-Path $dir)) { New-Item -ItemType Directory -Path $dir -Force | Out-Null }
[System.IO.File]::WriteAllBytes((Join-Path (Get-Location) $Out), [Convert]::FromBase64String($img.data))
Write-Host "OK -> $Out ($([Math]::Round($img.data.Length * 0.75 / 1KB)) KB, model=$modelId)"
