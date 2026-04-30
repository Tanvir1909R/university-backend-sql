import { createClient, SetOptions } from "redis";
import config from "../config";

const redisClient = createClient({
  url: config.redisUrl,
});

const redisSubClient = createClient({
  url: config.redisUrl,
});

const redisPubClient = createClient({
  url: config.redisUrl,
});

redisClient.on("error", (error) => console.log("RedisError", error));
redisClient.on("connect", () => console.log("Redis Connected"));

const connect = async (): Promise<void> => {
  await redisClient.connect();
  await redisPubClient.connect();
  await redisSubClient.connect();
};

const set = async(key:string,value:string,options?:SetOptions):Promise<void> =>{
    await redisClient.set(key,value,options)
}
const get = async(key:string):Promise<string | null> =>{
    return await redisClient.get(key)
}
const del = async(key:string):Promise<void> =>{
    await redisClient.del(key)
}

const setAccessToken = async(userId:string,token:string):Promise<void>=>{
    const key = `access-token7:${userId}`
    redisClient.set(key,token,{EX:+(config.redisTokenExpires!)})
}
const getAccessToken = async(userId:string):Promise<void>=>{
    const key = `access-token7:${userId}`
    redisClient.get(key)
}
const delAccessToken = async(userId:string):Promise<void>=>{
    const key = `access-token7:${userId}`
    redisClient.del(key)
}

const disconnect = async (): Promise<void> => {
    await redisClient.quit();
    await redisPubClient.quit();
    await redisSubClient.quit();
  };

export const RedisClient = {
  connect,
  set,
  get,
  del,
  getAccessToken,
  setAccessToken,
  delAccessToken,
  disconnect,
  publish: redisPubClient.publish.bind(redisPubClient),
  subscribe: redisSubClient.subscribe.bind(redisSubClient),
};
