# Deploy Azure Function App for F&B Wordle application
# Usage: ./deploy-function-app.ps1 -Environment <dev|test|prod> -ResourceGroupName <resource-group-name> -Location <azure-region>

param(
    [Parameter(Mandatory = $true)]
    [ValidateSet('dev', 'test', 'prod')]
    [string]$Environment,

    [Parameter(Mandatory = $true)]
    [string]$ResourceGroupName,

    [Parameter(Mandatory = $false)]
    [string]$Location = "eastus",

    [Parameter(Mandatory = $false)]
    [string]$CosmosDbConnectionString,

    [Parameter(Mandatory = $false)]
    [string]$StaticWebAppUrl,

    [Parameter(Mandatory = $false)]
    [switch]$ValidateOnly
)

# Set error action preference
$ErrorActionPreference = "Stop"

# Define paths
$templateFile = "$PSScriptRoot/arm-templates/function-app.json"
$parametersFile = "$PSScriptRoot/arm-templates/parameters/function-app-$Environment.parameters.json"

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

# Prepare additional parameters if provided
$additionalParams = @{}

if ($CosmosDbConnectionString) {
    $additionalParams.Add("cosmosDbConnectionString", $CosmosDbConnectionString)
    Write-Host "Using provided Cosmos DB connection string."
}

if ($StaticWebAppUrl) {
    $additionalParams.Add("staticWebAppUrl", $StaticWebAppUrl)
    Write-Host "Using provided Static Web App URL: $StaticWebAppUrl"
}

# Deploy or validate template
$deploymentName = "fbwordle-function-$Environment-$(Get-Date -Format 'yyyyMMdd-HHmmss')"

if ($ValidateOnly) {
    # Validate template
    Write-Host "Validating Function App ARM template..."
    
    if ($additionalParams.Count -gt 0) {
        $result = Test-AzResourceGroupDeployment -ResourceGroupName $ResourceGroupName `
            -TemplateFile $templateFile `
            -TemplateParameterFile $parametersFile `
            @additionalParams
    }
    else {
        $result = Test-AzResourceGroupDeployment -ResourceGroupName $ResourceGroupName `
            -TemplateFile $templateFile `
            -TemplateParameterFile $parametersFile
    }
    
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
    Write-Host "Deploying Function App ARM template to $Environment environment..."
    
    if ($additionalParams.Count -gt 0) {
        $deployment = New-AzResourceGroupDeployment -Name $deploymentName `
            -ResourceGroupName $ResourceGroupName `
            -TemplateFile $templateFile `
            -TemplateParameterFile $parametersFile `
            @additionalParams `
            -Mode Incremental
    }
    else {
        $deployment = New-AzResourceGroupDeployment -Name $deploymentName `
            -ResourceGroupName $ResourceGroupName `
            -TemplateFile $templateFile `
            -TemplateParameterFile $parametersFile `
            -Mode Incremental
    }

    if ($deployment.ProvisioningState -eq "Succeeded") {
        Write-Host "Deployment succeeded."
        
        # Output key information
        Write-Host "---------- Deployment Outputs ----------"
        Write-Host "Function App Name: $($deployment.Outputs.functionAppName.Value)"
        Write-Host "Function App URL: https://$($deployment.Outputs.functionAppHostName.Value)"
        Write-Host "Storage Account: $($deployment.Outputs.storageAccountName.Value)"
        Write-Host "App Service Plan: $($deployment.Outputs.appServicePlanName.Value)"
        Write-Host "Application Insights: $($deployment.Outputs.appInsightsName.Value)"
        Write-Host "---------------------------------------"
    }
    else {
        Write-Error "Deployment failed."
        exit 1
    }
}
