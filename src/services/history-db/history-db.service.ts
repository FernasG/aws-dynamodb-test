import { Injectable } from '@nestjs/common';
import { ServiceConfigurationOptions } from 'aws-sdk/lib/service';
import { DynamoDB, config, AWSError } from 'aws-sdk';
import { 
    PutItemInput, 
    ScanInput, 
    ScanOutput, 
    GetItemInput, 
    DeleteItemInput, 
    UpdateItemInput 
} from 'aws-sdk/clients/dynamodb';

@Injectable()
export class HistoryDbService {
    dynamodb: DynamoDB;
    docClient: DynamoDB.DocumentClient;

    constructor () {
        const serviceConfigOptions: ServiceConfigurationOptions = {
            endpoint: 'http://localhost:4200',
            region: 'us-west-2'
        };

        config.update({
            region: 'us-west-2'
        });

        this.dynamodb = new DynamoDB(serviceConfigOptions);
        this.docClient = new DynamoDB.DocumentClient({
            endpoint: 'http://localhost:4200'
        });

        var params = {
            TableName : 'message-history',
            KeySchema: [       
                { AttributeName: 'identifier', KeyType: 'HASH'},  //Partition key
                // { AttributeName: 'externalId', KeyType: 'RANGE' }  //Sort key
            ],
            AttributeDefinitions: [       
                { AttributeName: 'identifier', AttributeType: 'S' }
            ],
            ProvisionedThroughput: {       
                ReadCapacityUnits: 5, 
                WriteCapacityUnits: 5
            }
        };

        this.dynamodb.listTables((err, data) => {
            if(!(data.TableNames.includes(params.TableName))){
                this.dynamodb.createTable(params, function(err, data) {
                    if (err) {
                        console.error('Unable to create table. Error JSON:', JSON.stringify(err, null, 2));
                    } else {
                        console.log('Created table. Table description JSON:', JSON.stringify(data, null, 2));
                    }
                });
            }else {
                console.log('Table already exists.');
            }
        });

    }

    async createItem(params: PutItemInput): Promise<any> {
        return new Promise((resolve, reject) => {
            this.docClient.put(params, (err, data) => {
                if (err) {
                    reject({
                        ...err,
                        error: true
                    });
                }else{
                    resolve({
                        statusCode: 201,
                        error: false
                    });
                } 
            });
        });
    }

    async getAllItens(params: ScanInput): Promise<any> {
        return new Promise((resolve, reject) => {
            this.docClient.scan(params, onScan);

            function onScan(err: AWSError, data: ScanOutput) {
                if (err) {
                    reject({
                        ...err,
                        error: true
                    });
                }else {
                    if (typeof data.LastEvaluatedKey != "undefined") {
                        params.ExclusiveStartKey = data.LastEvaluatedKey;
                        this.docClient.scan(params, onScan);
                    }else {
                        resolve({
                            statusCode: 200,
                            error: false,
                            data
                        });
                    }
                }
            }
        });
    }

    getItemByIdentifier(params: GetItemInput): any {
        return new Promise((resolve, reject) => {
            this.docClient.get(params, (err, data) => {
                if (err) {
                    reject({
                        ...err,
                        error: true
                    });
                } else {
                    resolve({
                        statusCode: 200,
                        error: false,
                        data
                    });
                }
            });
        });
    }   

    async deleteItem(params: DeleteItemInput): Promise<any> {
        return new Promise((resolve, reject) => {
            this.docClient.delete(params, (err, data) => {
                if (err) {
                    reject({
                        ...err,
                        error: true
                    });
                }else {
                    resolve({
                        statusCode: 200,
                        error: false,
                        data
                    });
                }
            });
        });
    }

    async updateItem(params: UpdateItemInput): Promise<any> {
        return new Promise((resolve, reject) => {
            this.docClient.update(params, (err, data) => {
                if (err) {
                    reject({
                        ...err,
                        error: true
                    });
                }else {
                    resolve({
                        statusCode: 200,
                        error: false,
                        data
                    });
                }
            });
        })
    }
}
