[CmdletBinding()]
param()

$ErrorActionPreference = 'Stop'

$evidenceDir = [System.IO.Path]::GetFullPath($PSScriptRoot).TrimEnd([char[]]@('\', '/'))
$projectRoot = [System.IO.Directory]::GetParent($evidenceDir).FullName
$projectRoot = [System.IO.Path]::GetFullPath($projectRoot).TrimEnd([char[]]@('\', '/'))
$evidencePrefix = $evidenceDir + [System.IO.Path]::DirectorySeparatorChar

$files = @(Get-ChildItem -LiteralPath $projectRoot -Force -Recurse -File |
    Where-Object { -not $_.FullName.StartsWith($evidencePrefix, [System.StringComparison]::OrdinalIgnoreCase) } |
    Sort-Object FullName)

$lines = foreach ($file in $files) {
    $hash = (Get-FileHash -LiteralPath $file.FullName -Algorithm SHA256).Hash.ToLowerInvariant()
    $relativePath = $file.FullName.Substring($projectRoot.Length + 1).Replace('\', '/')
    '{0}  {1}' -f $hash, $relativePath
}

$outputPath = Join-Path $evidenceDir 'SHA256SUMS.txt'
[System.IO.File]::WriteAllLines($outputPath, [string[]]$lines, [System.Text.UTF8Encoding]::new($false))
Write-Host ('Wrote {0} SHA-256 entries to {1}' -f $files.Count, $outputPath)