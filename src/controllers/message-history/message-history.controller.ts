import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import {
    PutItemInput,
    ScanInput,
    GetItemInput,
    DeleteItemInput,
    UpdateItemInput
} from 'aws-sdk/clients/dynamodb';
import { HistoryDbService } from '../../services/history-db/history-db.service';

@Controller('history')
export class MessageHistoryController {
    constructor(
        private historyDBService: HistoryDbService
    ) { }

    @Post()
    async receiveMessage(@Body() body: any) {
        // const date = (new Date()).toLocaleString('pt-BR');
        let response = null;

        const findItem = await this.historyDBService.getItemByIdentifier({
            TableName: 'message-history',
            Key: { identifier: body.identifier }
        });

        if (findItem.data.Item) {
            let { history } = findItem.data.Item;

            if (body.input) {
                history.push(body.input);
            }

            response = {
                statusCode: 200,
                error: false,
                message: {}
            }
        } else {
            let params: PutItemInput = {
                TableName: 'message-history',
                Item: {
                    identifier: body.identifier,
                    assistent_id: body.assistantId
                }
            };

            if (body.input) {
                Object.assign(params.Item, {
                    history: [
                        body.input
                    ]
                });
            };

            if (body.response) {
                Object.assign(params.Item, {
                    response: [ 
                        body.response
                    ]
                });
            }

            response = await this.historyDBService.createItem(params);
        }

        return {
            code: response.statusCode,
            error: response.error,
            data: {
                message: response.message
            }
        };
    }

    @Get()
    async findAll() {
        const params: ScanInput = {
            TableName: 'message-history'
        }

        const response = await this.historyDBService.getAllItens(params);

        return {
            code: response.statusCode,
            error: response.error,
            data: {
                message: response.message,
                messages: response.data
            }
        }
    }

    @Get(':id')
    async findOne(@Param('id') identifier: any) {
        const params: GetItemInput = {
            TableName: 'message-history',
            Key: {
                identifier: identifier
            }
        }

        const response = this.historyDBService.getItemByIdentifier(params);
        console.log(response);

        return {
            code: response.statusCode,
            error: response.error,
            data: {
                message: response.data
            }
        }
    }

    @Delete()
    async deleteItem(@Body() body: any) {
        const params: DeleteItemInput = {
            TableName: 'message-history',
            Key: {
                identifier: body.identifier
            }
        }

        const response = await this.historyDBService.deleteItem(params);

        return {
            code: response.statusCode,
            error: response.error,
            data: {
                message: response.data
            }
        }
    }

    @Put()
    async updateItem(@Body() body: any) {
        const params: UpdateItemInput = {
            TableName: 'message-history',
            Key: {
                identifier: body.identifier
            },
            UpdateExpression: "SET #txt = :val",
            ExpressionAttributeValues: {
                ':val': body.input
            },
            ExpressionAttributeNames: {
                '#txt': 'input'
            },
            ReturnValues: "UPDATED_NEW"
        }

        const response = await this.historyDBService.updateItem(params);

        return {
            code: response.statusCode,
            error: response.error,
            data: {
                message: response.data
            }
        }
    }
}
