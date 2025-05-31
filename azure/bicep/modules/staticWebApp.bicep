param staticWebAppName string
param location string
param appInsightsInstrumentationKey string

resource staticWebApp 'Microsoft.Web/staticSites@2021-02-01' = {
  name: staticWebAppName
  location: location
  sku: {
    name: 'Free'
    tier: 'Free'
  }
  properties: {
    // You can configure build properties here, but often this is done via GitHub Actions
  }
}

// Link Application Insights to the Static Web App
resource staticWebAppAppInsights 'Microsoft.Web/staticSites/config@2021-02-01' = {
  parent: staticWebApp
  name: 'appsettings'
  properties: {
    APPINSIGHTS_INSTRUMENTATIONKEY: appInsightsInstrumentationKey
  }
}

output staticWebAppHostname string = staticWebApp.properties.defaultHostname
output staticWebAppApiKey string = staticWebApp.listSecrets().properties.apiKey
