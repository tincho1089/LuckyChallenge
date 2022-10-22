import * as sql from 'mssql';
import { ConfigService } from '@nestjs/config';
//'DESKTOP-VH3J0T8\\SQLEXPRESS', 
export const config = () => {
  const configService = new ConfigService();
  return {
    user: configService.get('DB_USERNAME'),
    password: configService.get('DB_PASSWORD'),
    server: configService.get('DB_SERVER'),
    database: configService.get('DB_DATABASE_NAME'),
    connectionTimeout: 20000,
    requestTimeout: 200000,
    options: {
      trustServerCertificate: true, // change to true for local dev / self-signed certs
    },
    pool: {
      max: 10000,
      min: 0,
      idleTimeoutMillis: 30000,
      acquireTimeoutMillis: 15000,
    },
  };
};

export async function openConnection(flgTran = true) {
  try {
    await sql.connect(config()).catch((err) => {
      console.log(err);
    });
    const transaction = flgTran ? new sql.Transaction(/* [pool] */) : null;

    return { sql, transaction };
  } catch (error) {
    return error;
  }
}

function validateType(type: string) {
  switch (type) {
    case 'string':
      return sql.VarChar;
      break;
    case 'int':
      return sql.Int;
      break;
    default:
      return sql.VarChar;
      break;
  }
}

export async function runTransQuery(
  queryString: string,
  trx: any,
  arrParams: {
    key: string;
    type: string;
    value: string | number | undefined;
  }[],
) {
  const request = new sql.Request(trx);
  if (arrParams.length > 0) {
    arrParams.forEach((element) => {
      request.input(element.key, validateType(element.type), element.value);
    });
  }

  const response = await request
    .query(queryString)
    .then((callback: { recordset: { any: any }[] }) => {
      return callback;
    })
    .catch((err: any) => {
      return trx ? closeTransaction(trx, err) : null;
    });
  return response;
}

export async function closeTransaction(transaction: sql.Transaction, err: any) {
  if (err) {
    await transaction.rollback(err);
    console.log(err);
    return err; //done
  } else {
    const rsp = await transaction
      .commit()
      .then(() => {
        return 'Transaction committed successfully';
      })
      .catch((err: any) => {
        return err;
      });
    return rsp;
  }
}
