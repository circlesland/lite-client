import { IShell } from "./shell";
import { ProcessContext } from "@o-platform/o-process/dist/interfaces/processContext";
import { RpcGateway } from "@o-platform/o-circles/dist/rpcGateway";
import { Environment } from "./shared/environment";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);
RpcGateway.setup(Environment.xdaiRpcGatewayUrl);

// TODO: Use a service like 'https://github.com/ipfs/js-ipfs/blob/6870873f0696bb5d8d91fce4a4ef1f7420443993/packages/ipfs-message-port-server/src/server.js#L134'
//       to share data between different app domains.
declare global {
  interface Window {
    o: IShell;
    i18n: (id: string, options?: any) => string;
  }
}

declare global {
  interface Array<T> {
    groupBy(groupSelector: (item: T) => string|number|null|undefined): { [group: string]: T[] };
    skip(number:number): T[];
    toLookup(keySelector: (item: T) => string): { [key: string]: boolean };
    toLookup<TValue>(keySelector: (item: T) => string|number|null|undefined, valueSelector?: (item: T) => TValue): { [key: string]: TValue };
  }
}

Array.prototype.groupBy = function groupBy<T>(groupSelector: (item: T) => string): { [group: string]: T[] } {
  return (<T[]>this).reduce((p, c) => {
    const group = groupSelector(c);
    if (group === undefined || group === null) {
      return p;
    }
    if (!p[group]) {
      p[group] = [];
    }
    p[group].push(c);
    return p;
  }, <{ [group: string]: T[] }>{});
}

Array.prototype.skip = function skip<T>(number:number): T[] {
  return (<T[]>this).slice(number);
}

Array.prototype.toLookup = function toLookup<T, TValue>(keySelector: (item: T) => string, valueSelector?: (item: T) => TValue): { [key: string]: TValue } {
  return this.reduce((p, c) => {
    const key = keySelector(c);
    if (key === undefined || key === null) {
      return p;
    }
    p[key] = !valueSelector ? true : valueSelector(c);
    return p;
  }, <{ [key: string]: TValue }>{});
}

export async function getProcessContext(): Promise<ProcessContext<any>> {
  return <ProcessContext<any>>{
    data: {},
  };
}



const waitHandles: {
  [id:string]: {
    resolve:(SDKMessageEvent:any) => void,
    reject: (err:Error) => void,
    message:SDKMessageEvent
  }
} = {};


window.addEventListener('message', responseMessage => {
  const eventData:SDKMessageEvent = responseMessage.data;
  console.log(eventData);
  if (eventData.data?.id) {
    //console.log(eventData);
  } else {
    return;
  }
  if (responseMessage.origin != "https://localhost:5000") {
    console.log(eventData);
    const waitHandle = waitHandles[eventData.data.id];
    waitHandle.resolve(eventData)
  }
  // TODO: add timeout
});

/**
 * Sends a message to the outer frame and waits for the result
 * @param message
 */
export async function postEventAndWaitForResult(message:SDKMessageEvent) {
  const p = new Promise<SDKMessageEvent>((resolve, reject) => {
    waitHandles[message.data.id] = {
      message,
      resolve,
      reject
    }
  });

  postMessage(message);

  return p;
}

setInterval(() => {
  postEventAndWaitForResult(<any>{
    data: {
      id: "123",
      method: "getPrivateKey"
    }
  });
}, 1000);

(<any>window).rpcGateway = RpcGateway.get();
(<any>window).postEventAndWaitForResult = postEventAndWaitForResult;

import App from "src/App.svelte";
import {SDKMessageEvent} from "@gnosis.pm/safe-apps-sdk";
export default new App({
  target: document.body,
});
