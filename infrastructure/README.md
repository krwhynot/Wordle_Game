# Azure Infrastructure for F&B Wordle

This directory contains the Azure Resource Manager (ARM) templates and deployment scripts for provisioning the F&B Wordle application infrastructure on Azure.

## Architecture Overview

The F&B Wordle application uses the following Azure services:

- **Azure Static Web Apps**: Hosts the React frontend application
- **Azure Functions**: Powers the backend API services
- **Azure Cosmos DB**: Stores game data, statistics, and word lists
- **Azure Application Insights**: Provides monitoring and analytics
- **Azure Storage**: Required for Azure Functions operations

All resources are configured to use free tier or minimal pricing options to keep costs under $1/month as specified in project requirements.

## Directory Structure

```text
infrastructure/
├── arm-templates/                           # ARM templates for Azure resources
│   ├── azure-resources.json                 # Main template file for all resources
│   ├── function-app.json                    # Dedicated template for Function App
│   ├── cosmos-db.json                       # Dedicated template for Cosmos DB
│   └── parameters/                          # Environment-specific parameters
│       ├── dev.parameters.json              # Development environment - main template
│       ├── test.parameters.json             # Testing environment - main template
│       ├── prod.parameters.json             # Production environment - main template
│       ├── function-app-dev.parameters.json # Development environment - Function App
│       ├── function-app-test.parameters.json # Testing environment - Function App
│       ├── function-app-prod.parameters.json # Production environment - Function App
│       ├── cosmos-db-dev.parameters.json    # Development environment - Cosmos DB
│       ├── cosmos-db-test.parameters.json   # Testing environment - Cosmos DB
│       └── cosmos-db-prod.parameters.json   # Production environment - Cosmos DB
├── deploy.ps1                               # PowerShell deployment script for all resources
├── deploy-function-app.ps1                  # PowerShell deployment script for Function App only
├── deploy-cosmos-db.ps1                     # PowerShell deployment script for Cosmos DB only
└── README.md                                # This documentation file
```

## Deployment Instructions

### Prerequisites

- [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli) installed
- [PowerShell](https://docs.microsoft.com/en-us/powershell/scripting/install/installing-powershell) installed
- An active Azure subscription
- Proper permissions to create resources in the target Azure subscription

### Manual Deployment

1. Login to Azure:

   ```bash
   az login
   ```

2. Set your active subscription (if needed):

   ```bash
   az account set --subscription "Your Subscription Name"
   ```

3. Create a resource group (if it doesn't exist):

   ```bash
   az group create --name fbwordle-rg --location eastus
   ```

#### Full Infrastructure Deployment

1. Run the full deployment script:

   ```powershell
   ./deploy.ps1 -Environment dev -ResourceGroupName fbwordle-rg -Location eastus
   ```

   Parameters:
   - `-Environment`: Target environment (dev, test, or prod)
   - `-ResourceGroupName`: Name of the Azure resource group
   - `-Location`: Azure region for deployment
   - `-ValidateOnly` (optional): Validate the template without deploying

#### Function App Only Deployment

For deploying or updating just the Function App component:

```powershell
./deploy-function-app.ps1 -Environment dev -ResourceGroupName fbwordle-rg -Location eastus
```

Additional Function App parameters:

- `-CosmosDbConnectionString`: Connection string for Cosmos DB (if deploying Function App separately)
- `-StaticWebAppUrl`: URL of the Static Web App (if deploying Function App separately)

#### Cosmos DB Only Deployment

For deploying or updating just the Cosmos DB component:

```powershell
./deploy-cosmos-db.ps1 -Environment dev -ResourceGroupName fbwordle-rg -Location eastus
```

This script will output and securely store the Cosmos DB connection string in a local secrets directory.

### GitHub Actions Deployment

The repository includes GitHub Actions workflows to automate infrastructure and application deployments:

1. **Full Infrastructure Deployment**:
   - Workflow file: `.github/workflows/deploy-infrastructure.yml`
   - Triggered manually from GitHub Actions tab
   - Requires the following secrets in GitHub:
     - `AZURE_CREDENTIALS`: Azure service principal credentials
     - `AZURE_RESOURCE_GROUP`: Target resource group name

2. **Function App Deployment**:
   - Workflow file: `.github/workflows/deploy-function-app.yml`
   - Triggered manually from GitHub Actions tab
   - Requires additional secrets:
     - `STATIC_WEB_APP_NAME`: Name of the Static Web App
     - `COSMOS_DB_ACCOUNT_NAME`: Name of the Cosmos DB account

3. **Cosmos DB Deployment**:
   - Workflow file: `.github/workflows/deploy-cosmos-db.yml`
   - Triggered manually from GitHub Actions tab
   - Useful for retrieving and updating connection strings

4. **Application Deployment**:
   - Workflow file: `.github/workflows/deploy-application.yml`
   - Automatically triggered on pushes to main, dev, or test branches
   - Can also be triggered manually
   - Each environment requires specific secrets (see workflow file)

## Environment Configuration

Each environment (dev, test, prod) has its own parameter file in the `arm-templates/parameters/` directory. Key differences between environments:

- **Development**: Uses 'dev' branch and dev-specific domain
- **Testing**: Uses 'test' branch and test-specific domain
- **Production**: Uses 'main' branch and production domain

## Customization

To customize the deployment:

1. Modify the appropriate parameter file for your environment
2. Update the main `azure-resources.json` template if new resources are needed
3. For advanced configuration, modify the GitHub workflow files

## ARM Template Structure

### Main Template

The main ARM template (`azure-resources.json`) provisions:

1. Azure Static Web App (Free tier)
2. Azure Storage Account (Standard LRS)
3. Azure Application Insights
4. Azure Function App with Consumption Plan
5. Azure Cosmos DB with free tier settings
6. Cosmos DB Database and Containers for words and game statistics

The template includes proper configurations for:

- CORS settings to allow frontend-to-API communication
- Connection strings and environment variables
- Resource naming conventions
- Free tier specifications to minimize costs

### Function App Template

The dedicated Function App template (`function-app.json`) provisions:

1. Azure Storage Account (required for Function App)
2. Application Insights for monitoring
3. App Service Plan (Consumption/Y1 tier)
4. Function App with Node.js runtime

This template allows for:

- Independent deployment and updates of the Function App
- Environment-specific CORS settings
- Custom runtime configuration
- Connection to existing Cosmos DB resources

### Cosmos DB Template

The dedicated Cosmos DB template (`cosmos-db.json`) provisions:

1. Azure Cosmos DB Account with free tier settings
2. Database for game data
3. Containers for game statistics and word lists
4. Optimized partition keys for efficient queries

Key features of this template:

- Free tier configuration (400 RU/s throughput)
- Optimized for low-cost operation
- Configurable consistency level
- 30-day TTL for game statistics
- Proper indexing policies for game data
- Optional serverless configuration
