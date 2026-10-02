[CmdletBinding()]
param()

$ErrorActionPreference = 'Stop'
$projectRoot = [System.IO.Directory]::GetParent($PSScriptRoot).FullName
$checkerPath = Join-Path $projectRoot 'scripts/check-assets.ts'

# The checked catalog is the current inventory. Never overwrite archive evidence.
& node $checkerPath
if ($LASTEXITCODE -ne 0) {
    throw 'Asset verification failed. No historical checksums were changed.'
}
Write-Host 'Current checksums: output/checks/SHA256SUMS-current.txt'
