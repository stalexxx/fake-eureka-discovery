// export class Eureka {
//     constructor(config: EurekaClient.EurekaConfig)
//     start(): void;
//     stop(): void;
//     getInstancesByAppId(appId: string): string[];
//     getInstancesByVipAddress(vidAddress: string): string [];
// }

export namespace EurekaClient {
    export type InstanceStatus = 'UP' | 'DOWN' | 'STARTING' | 'OUT_OF_SERVICE' | 'UNKNOWN';
    // @ts-ignore
    export type ActionType = 'ADDED' | 'MODIFIED' | 'DELETED';
    export type DataCenterName = 'Netflix' | 'Amazon' | 'MyOwn';

    // @ts-ignore
    interface EurekaConfig {
        instance: EurekaInstanceConfig;
        eureka: EurekaClientConfig;
    }

    export interface EurekaInstanceConfig {
        app: string;
        hostName: string;
        ipAddr: string;
        vipAddress: string;
        dataCenterInfo: DataCenterInfo;
        port?: PortWrapper;
        instanceId?: string;
        appGroupName?: string;
        sid?: string;
        securePort?: PortWrapper;
        homePageUrl?: string;
        statusPageUrl?: string;
        healthCheckUrl?: string;
        secureHealthCheckUrl?: string;
        secureVipAddress?: string;
        countryId?: number;
        status?: InstanceStatus;
        overriddenstatus?: InstanceStatus;
        leaseInfo?: LeaseInfo;
        isCoordinatingDiscoveryServer?: boolean;
        metadata: Metadata;
        lastUpdatedTimestamp: number;
        lastDirtyTimestamp: number;
        actionType: ActionType;
    }

    export interface EurekaClientConfig {
        host: string;
        port: number;
        heartbeatInterval?: number;
        registryFetchInterval?: number;
        maxRetries?: number;
        requestRetryDelay?: number;
        fetchRegistry?: boolean;
        filterUpInstances?: boolean;
        servicePath?: string;
        ssl?: boolean;
        useDns?: boolean;
        preferSameZone?: boolean;
        clusterRefreshInterval?: boolean;
        fetchMetadata?: boolean;
        registerWithEureka?: boolean;
        useLocalMetadata?: boolean;
        preferIpAddress?: boolean;
    }

    interface PortWrapperEnabled {
        enabled: boolean;
    }

    export interface PortWrapper {
        '#': number;
        '@': PortWrapperEnabled;
    }

    export interface LeaseInfo {
        renewalIntervalInSecs: number;
        durationInSecs: number;
        registrationTimestamp: number;
        lastRenewalTimestamp: number;
        evictionTimestamp: number;
        serviceUpTimestamp: number;
    }

    export interface DataCenterInfoAttrs {
        'class': string;
    }

    export interface DataCenterInfo {
        name: DataCenterName;
        '@': DataCenterInfoAttrs;
    }

    export interface Metadata {
        instanceId: string;
        'management.port': number;
        'management.context-path': string;
    }

    interface Config {
        name: string;
        host: string;
        port: number;
    }

    export function appsObjects(configs: Config[]) {
        return {
            'versions__delta': 1,
            'apps__hashcode': 'UP_' + configs.length,
            applications: configs.map(c => appObject(c))
        };
    }

    export function appObject(config: Config) {

        const {name, host, port} = config;
        const nameLower = name.toString();
        const homePageUrl = 'http://' + host + ':' + port + '/';
        return {
            app: name,
            appGroupName: name,
            countryId: 1,
            hostName: host,
            instanceId: host + ':' + nameLower + ':' + port,
            ipAddr: host,
            isCoordinatingDiscoveryServer: false,
            overriddenstatus: 'UNKNOWN',
            // secureHealthCheckUrl:,
            secureVipAddress: nameLower,
            status: 'UP',
            homePageUrl: homePageUrl,
            healthCheckUrl: homePageUrl + 'management/health',
            statusPageUrl: homePageUrl + 'management/info',
            vipAddress: nameLower,
            lastUpdatedTimestamp: 7258118400000,
            lastDirtyTimestamp: 7258118400000,
            actionType: 'ADDED',
            dataCenterInfo: {
                '@': {class: '"com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo"'},
                name: 'MyOwn'
            },
            leaseInfo: {
                durationInSecs: 90,
                renewalIntervalInSecs: 30,
                registrationTimestamp: 1514764800, // 2018 jan 1
                lastRenewalTimestamp: 7258118400000,
                evictionTimestamp: 0,
                serviceUpTimestamp: 7258118400000// 2200 jan 1
            },
            port: {
                '#': port,
                '@': {enabled: true}
            },
            securePort: {
                '#': 443,
                '@': {enabled: false}
            },
            metadata: {
                instanceId: name + ':' + port,
                'management.port': port,
                'management.context-path': '/management'
            },
        };
    }
}
