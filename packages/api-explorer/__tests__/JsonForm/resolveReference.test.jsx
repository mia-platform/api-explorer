/* eslint-disable no-use-before-define */
import resolveReference from '../../src/JsonForm/resolveReference'

test('resolve correctly', async () => {
    const resp = await resolveReference(SCHEMA_BUG)
    expect(resp).toEqual(EXPECTED_SCHEMA_BUG)
})



const SCHEMA_BUG = {
    "components": {
        "securitySchemes": {
            "petstore_auth": {
                "type": "oauth2",
                "flows": {
                    "implicit": {
                        "authorizationUrl": "http://petstore.swagger.io/oauth/dialog",
                        "scopes": {
                            "write:pets": "modify pets in your account",
                            "read:pets": "read your pets"
                        }
                    }
                },
                "_key": "petstore_auth"
            },
            "api_key": {
                "type": "apiKey",
                "name": "api_key",
                "in": "header"
            }
        },
        "schemas": {
            "Order": {
                "type": "object",
                "properties": {
                    "id": {
                        "type": "integer",
                        "format": "int64"
                    },
                    "petId": {
                        "type": "integer",
                        "format": "int64"
                    },
                    "quantity": {
                        "type": "integer",
                        "format": "int32"
                    },
                    "shipDate": {
                        "type": "string",
                        "format": "date-time"
                    },
                    "status": {
                        "type": "string",
                        "description": "Order Status",
                        "enum": [
                            "placed",
                            "approved",
                            "delivered"
                        ]
                    },
                    "complete": {
                        "type": "boolean",
                        "default": false
                    }
                },
                "xml": {
                    "name": "Order"
                }
            },
            "Category": {
                "type": "object",
                "properties": {
                    "id": {
                        "type": "integer",
                        "format": "int64"
                    },
                    "name": {
                        "type": "string"
                    }
                },
                "xml": {
                    "name": "Category"
                }
            },
            "User": {
                "type": "object",
                "properties": {
                    "id": {
                        "type": "integer",
                        "format": "int64"
                    },
                    "username": {
                        "type": "string"
                    },
                    "firstName": {
                        "type": "string"
                    },
                    "lastName": {
                        "type": "string"
                    },
                    "email": {
                        "type": "string"
                    },
                    "password": {
                        "type": "string"
                    },
                    "phone": {
                        "type": "string"
                    },
                    "userStatus": {
                        "type": "integer",
                        "format": "int32",
                        "description": "User Status"
                    }
                },
                "xml": {
                    "name": "User"
                }
            },
            "Tag": {
                "type": "object",
                "properties": {
                    "id": {
                        "type": "integer",
                        "format": "int64"
                    },
                    "name": {
                        "type": "string"
                    }
                },
                "xml": {
                    "name": "Tag"
                }
            },
            "Pet": {
                "type": "object",
                "required": [
                    "name",
                    "photoUrls"
                ],
                "properties": {
                    "id": {
                        "type": "integer",
                        "format": "int64"
                    },
                    "category": {
                        "$ref": "#/components/schemas/Category"
                    },
                    "name": {
                        "type": "string",
                        "example": "doggie"
                    },
                    "photoUrls": {
                        "type": "array",
                        "xml": {
                            "name": "photoUrl",
                            "wrapped": true
                        },
                        "items": {
                            "type": "string"
                        }
                    },
                    "tags": {
                        "type": "array",
                        "xml": {
                            "name": "tag",
                            "wrapped": true
                        },
                        "items": {
                            "$ref": "#/components/schemas/Tag"
                        }
                    },
                    "status": {
                        "type": "string",
                        "description": "pet status in the store",
                        "enum": [
                            "available",
                            "pending",
                            "sold"
                        ]
                    }
                },
                "xml": {
                    "name": "Pet"
                }
            },
            "ApiResponse": {
                "type": "object",
                "properties": {
                    "code": {
                        "type": "integer",
                        "format": "int32"
                    },
                    "type": {
                        "type": "string"
                    },
                    "message": {
                        "type": "string"
                    }
                }
            }
        }
    },
    "$ref": "#/components/schemas/Pet"
}


const EXPECTED_SCHEMA_BUG = {
    "components": {
        "securitySchemes": {
            "petstore_auth": {
                "type": "oauth2",
                "flows": {
                    "implicit": {
                        "authorizationUrl": "http://petstore.swagger.io/oauth/dialog",
                        "scopes": {
                            "write:pets": "modify pets in your account",
                            "read:pets": "read your pets"
                        }
                    }
                },
                "_key": "petstore_auth"
            },
            "api_key": {
                "type": "apiKey",
                "name": "api_key",
                "in": "header"
            }
        },
        "schemas": {
            "Order": {
                "type": "object",
                "properties": {
                    "id": {
                        "type": "integer",
                        "format": "int64"
                    },
                    "petId": {
                        "type": "integer",
                        "format": "int64"
                    },
                    "quantity": {
                        "type": "integer",
                        "format": "int32"
                    },
                    "shipDate": {
                        "type": "string",
                        "format": "date-time"
                    },
                    "status": {
                        "type": "string",
                        "description": "Order Status",
                        "enum": [
                            "placed",
                            "approved",
                            "delivered"
                        ]
                    },
                    "complete": {
                        "type": "boolean",
                        "default": false
                    }
                },
                "xml": {
                    "name": "Order"
                }
            },
            "Category": {
                "type": "object",
                "properties": {
                    "id": {
                        "type": "integer",
                        "format": "int64"
                    },
                    "name": {
                        "type": "string"
                    }
                },
                "xml": {
                    "name": "Category"
                }
            },
            "User": {
                "type": "object",
                "properties": {
                    "id": {
                        "type": "integer",
                        "format": "int64"
                    },
                    "username": {
                        "type": "string"
                    },
                    "firstName": {
                        "type": "string"
                    },
                    "lastName": {
                        "type": "string"
                    },
                    "email": {
                        "type": "string"
                    },
                    "password": {
                        "type": "string"
                    },
                    "phone": {
                        "type": "string"
                    },
                    "userStatus": {
                        "type": "integer",
                        "format": "int32",
                        "description": "User Status"
                    }
                },
                "xml": {
                    "name": "User"
                }
            },
            "Tag": {
                "type": "object",
                "properties": {
                    "id": {
                        "type": "integer",
                        "format": "int64"
                    },
                    "name": {
                        "type": "string"
                    }
                },
                "xml": {
                    "name": "Tag"
                }
            },
            "Pet": {
                "type": "object",
                "required": [
                    "name",
                    "photoUrls"
                ],
                "properties": {
                    "id": {
                        "type": "integer",
                        "format": "int64"
                    },
                    "category": {
                        "type": "object",
                        "properties": {
                            "id": {
                                "type": "integer",
                                "format": "int64"
                            },
                            "name": {
                                "type": "string"
                            }
                        },
                        "xml": {
                            "name": "Category"
                        }
                    },
                    "name": {
                        "type": "string",
                        "example": "doggie"
                    },
                    "photoUrls": {
                        "type": "array",
                        "xml": {
                            "name": "photoUrl",
                            "wrapped": true
                        },
                        "items": {
                            "type": "string"
                        }
                    },
                    "tags": {
                        "type": "array",
                        "xml": {
                            "name": "tag",
                            "wrapped": true
                        },
                        "items": {
                            "type": "object",
                            "properties": {
                                "id": {
                                    "type": "integer",
                                    "format": "int64"
                                },
                                "name": {
                                    "type": "string"
                                }
                            },
                            "xml": {
                                "name": "Tag"
                            }
                        }
                    },
                    "status": {
                        "type": "string",
                        "description": "pet status in the store",
                        "enum": [
                            "available",
                            "pending",
                            "sold"
                        ]
                    }
                },
                "xml": {
                    "name": "Pet"
                }
            },
            "ApiResponse": {
                "type": "object",
                "properties": {
                    "code": {
                        "type": "integer",
                        "format": "int32"
                    },
                    "type": {
                        "type": "string"
                    },
                    "message": {
                        "type": "string"
                    }
                }
            }
        }
    },
    "type": "object",
    "required": [
        "name",
        "photoUrls"
    ],
    "properties": {
        "id": {
            "type": "integer",
            "format": "int64"
        },
        "category": {
            "type": "object",
            "properties": {
                "id": {
                    "type": "integer",
                    "format": "int64"
                },
                "name": {
                    "type": "string"
                }
            },
            "xml": {
                "name": "Category"
            }
        },
        "name": {
            "type": "string",
            "example": "doggie"
        },
        "photoUrls": {
            "type": "array",
            "xml": {
                "name": "photoUrl",
                "wrapped": true
            },
            "items": {
                "type": "string"
            }
        },
        "tags": {
            "type": "array",
            "xml": {
                "name": "tag",
                "wrapped": true
            },
            "items": {
                "type": "object",
                "properties": {
                    "id": {
                        "type": "integer",
                        "format": "int64"
                    },
                    "name": {
                        "type": "string"
                    }
                },
                "xml": {
                    "name": "Tag"
                }
            }
        },
        "status": {
            "type": "string",
            "description": "pet status in the store",
            "enum": [
                "available",
                "pending",
                "sold"
            ]
        }
    },
    "xml": {
        "name": "Pet"
    }
}