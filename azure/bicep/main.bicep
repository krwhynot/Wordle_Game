param location string = 'eastus'
param cosmosDbAccountName string = 'wordlecosmosdb${uniqueString(resourceGroup().id)}'
param cosmosDbDatabaseName string = 'wordledb'
param cosmosDbCollectionName string = 'wordlecollection'
param appInsightsName string = 'wordle-appinsights'
param staticWebAppName string = 'wordle-swa'

module cosmos 'modules/cosmosDb.bicep' = {
  name: 'cosmosDbDeployment'
  params: {
    accountName: cosmosDbAccountName
    location: location
    databaseName: cosmosDbDatabaseName
    collectionName: cosmosDbCollectionName
  }
}

module appInsights 'modules/applicationInsights.bicep' = {
  name: 'appInsightsDeployment'
  params: {
    appInsightsName: appInsightsName
    location: location
  }
}

module staticWebApp 'modules/staticWebApp.bicep' = {
  name: 'staticWebAppDeployment'
  params: {
    staticWebAppName: staticWebAppName
    location: location
    appInsightsInstrumentationKey: appInsights.outputs.appInsightsInstrumentationKey
  }
  dependsOn: [
    appInsights
  ]
}

output cosmosDbConnectionString string = cosmos.outputs.cosmosDbConnectionString
output staticWebAppHostname string = staticWebApp.outputs.staticWebAppHostname
output staticWebAppApiKey string = staticWebApp.outputs.staticWebAppApiKey
