# Requires Azure CLI to be installed and logged in (az login)

$resourceGroupName = "wordle-rg"
$location = "eastus"
$templateFile = "..\bicep\main.bicep"

Write-Host "Deploying Azure resources to resource group: $resourceGroupName in location: $location"

az group create --name $resourceGroupName --location $location

az deployment group create --resource-group $resourceGroupName --template-file $templateFile --parameters location=$location

Write-Host "Deployment complete."
Write-Host "You can find the deployed resources in the Azure portal under resource group: $resourceGroupName"
