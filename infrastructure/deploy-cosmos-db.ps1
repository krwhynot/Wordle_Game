# Deploy Azure Cosmos DB for F&B Wordle application
# Usage: ./deploy-cosmos-db.ps1 -Environment <dev|test|prod> -ResourceGroupName <resource-group-name> -Location <azure-region>

param(
    [Parameter(Mandatory = $true)]
    [ValidateSet('dev', 'test', 'prod')]
    [string]$Environment,

    [Parameter(Mandatory = $true)]
    [string]$ResourceGroupName,

    [Parameter(Mandatory = $false)]
    [string]$Location = "eastus",

    [Parameter(Mandatory = $false)]
    [switch]$ValidateOnly
)

# Set error action preference
$ErrorActionPreference = "Stop"

# Define paths
$templateFile = "$PSScriptRoot/arm-templates/cosmos-db.json"
$parametersFile = "$PSScriptRoot/arm-templates/parameters/cosmos-db-$Environment.parameters.json"

# Verify files exist
if (-not (Test-Path $templateFile)) {
    Write-Error "Template file not found: $templateFile"
    exit 1
}

if (-not (Test-Path $parametersFile)) {
    Write-Error "Parameters file not found: $parametersFile"
    exit 1
}

# Check if resource group exists, create if not
$resourceGroup = Get-AzResourceGroup -Name $ResourceGroupName -ErrorAction SilentlyContinue
if (-not $resourceGroup) {
    Write-Host "Creating resource group '$ResourceGroupName' in location '$Location'..."
    New-AzResourceGroup -Name $ResourceGroupName -Location $Location
    Write-Host "Resource group created."
}
else {
    Write-Host "Using existing resource group '$ResourceGroupName'."
}

# Deploy or validate template
$deploymentName = "fbwordle-cosmos-$Environment-$(Get-Date -Format 'yyyyMMdd-HHmmss')"

if ($ValidateOnly) {
    # Validate template
    Write-Host "Validating Cosmos DB ARM template..."
    $result = Test-AzResourceGroupDeployment -ResourceGroupName $ResourceGroupName `
        -TemplateFile $templateFile `
        -TemplateParameterFile $parametersFile
    
    if ($result) {
        Write-Error "Template validation failed: $($result.Message)"
        exit 1
    }
    else {
        Write-Host "Template is valid."
    }
}
else {
    # Deploy template
    Write-Host "Deploying Cosmos DB ARM template to $Environment environment..."
    $deployment = New-AzResourceGroupDeployment -Name $deploymentName `
        -ResourceGroupName $ResourceGroupName `
        -TemplateFile $templateFile `
        -TemplateParameterFile $parametersFile `
        -Mode Incremental

    if ($deployment.ProvisioningState -eq "Succeeded") {
        Write-Host "Deployment succeeded."
        
        # Output key information
        Write-Host "---------- Deployment Outputs ----------"
        Write-Host "Cosmos DB Account Name: $($deployment.Outputs.cosmosDbAccountName.Value)"
        Write-Host "Cosmos DB Endpoint: $($deployment.Outputs.cosmosDbEndpoint.Value)"
        Write-Host "Database Name: $($deployment.Outputs.databaseName.Value)"
        Write-Host "Stats Container: $($deployment.Outputs.statsContainerName.Value)"
        Write-Host "Words Container: $($deployment.Outputs.wordsContainerName.Value)"
        Write-Host "---------------------------------------"
        
        # Output connection string (masked for security)
        $connectionString = $deployment.Outputs.cosmosDbConnectionString.Value
        $maskedConnectionString = $connectionString -replace "AccountKey=[^;]+", "AccountKey=***MASKED***"
        Write-Host "Connection String: $maskedConnectionString"
        
        # Optional: save connection string to a secure file for reference
        $secretsDir = "$PSScriptRoot/secrets"
        if (-not (Test-Path $secretsDir)) {
            New-Item -ItemType Directory -Path $secretsDir | Out-Null
            Write-Host "Created secrets directory."
        }
        
        $connectionStringFile = "$secretsDir/cosmos-$Environment-connection.txt"
        $connectionString | Out-File -FilePath $connectionStringFile
        Write-Host "Connection string saved to: $connectionStringFile"
        Write-Host "IMPORTANT: Secure this file as it contains sensitive information."
    }
    else {
        Write-Error "Deployment failed."
        exit 1
    }
}
