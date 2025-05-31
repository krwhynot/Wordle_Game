param(
  [string]$resourceGroupName = "fbwordle-rg",
  [string]$templateFile = "template.json",
  [string]$parameterFile = "parameters.json"
)

# Login is assumed
Write-Host "Deploying ARM template to RG: $resourceGroupName"

$templatePath = Join-Path $PSScriptRoot $templateFile
$parameterPath = Join-Path $PSScriptRoot $parameterFile

az deployment group create `
  --resource-group $resourceGroupName `
  --template-file $templatePath `
  --parameters $parameterPath `
  --verbose
