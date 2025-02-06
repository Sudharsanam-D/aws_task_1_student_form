import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as rds from 'aws-cdk-lib/aws-rds';
import * as iam from 'aws-cdk-lib/aws-iam';

export class BackendStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) { 
    super(scope, id, props);

    // Create an RDS Serverless Cluster (Aurora MySQL)
    // const dbCluster = new rds.ServerlessCluster(this, "MyRdsServerless", {
    //   engine: rds.DatabaseClusterEngine.AURORA_MYSQL,
    //   defaultDatabaseName: "student",
    //   credentials: rds.Credentials.fromPassword("student", cdk.SecretValue.unsafePlainText("root#123")),
    //   enableDataApi: true, // Allows Lambda to access RDS without needing a VPC
    // });

    // IAM Role for Lambda to access RDS
    const lambdaRole = new iam.Role(this, "LambdaExecutionRole", {
      assumedBy: new iam.ServicePrincipal("lambda.amazonaws.com"),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName("service-role/AWSLambdaBasicExecutionRole"),
        iam.ManagedPolicy.fromAwsManagedPolicyName("AmazonRDSDataFullAccess"), // Allows querying RDS
      ],
    });

    // Create Lambda Function
    const studentLambda = new lambda.Function(this, "StudentLambda", {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: "index.handler",
      code: lambda.Code.fromAsset("lambda"), // Path to Lambda code
      role: lambdaRole, // Attach IAM Role
      environment: {
        DB_HOST: 'student.c9ggkgk4as2p.eu-north-1.rds.amazonaws.com',
        DB_USER: "student",
        DB_PASSWORD: "root#123",
        DB_NAME: "student",
      },
    });

    // Create API Gateway
    const api = new apigateway.RestApi(this, "StudentApi", {
      restApiName: "Student Service", 
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,  // Allow all origins
        allowMethods: apigateway.Cors.ALL_METHODS,  // Allow all HTTP methods
      },
    });

    const students = api.root.addResource("students");
    students.addMethod("GET", new apigateway.LambdaIntegration(studentLambda));
    students.addMethod("POST", new apigateway.LambdaIntegration(studentLambda));
    students.addMethod("DELETE", new apigateway.LambdaIntegration(studentLambda))

    // Output API Gateway URL
    new cdk.CfnOutput(this, "ApiUrl", {
      value: api.url,
      description: "API Gateway Endpoint",
    });
  }
}
