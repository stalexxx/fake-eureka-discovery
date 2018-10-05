import {XMLElement, XMLAttribute, XMLChild} from 'xml-decorators';

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

    export interface PortWrapper {
        enabled: boolean;
        port: number;
    }

    export class PortWrapperImpl implements PortWrapper {
        // todo issue
        constructor(port: number) {
            this.port = port;
        }

        @XMLAttribute
        enabled: boolean = true;

        port: number;

        public toString(): string {
            return this.port.toString();
        }
    }

    export interface LeaseInfo {
        renewalIntervalInSecs: number;
        durationInSecs: number;
    }

    class LeaseInfoImpl implements LeaseInfo {
        @XMLChild
        durationInSecs: number = 90;
        @XMLChild
        renewalIntervalInSecs: number = 30;

        @XMLChild
        registrationTimestamp: number = 1514764800; // 2018 jan 1

        @XMLChild
        lastRenewalTimestamp: number = 7258118400000;
        @XMLChild
        evictionTimestamp: number = 0;
        @XMLChild
        serviceUpTimestamp = 7258118400000;// 2200 jan 1
    }

    export interface DataCenterInfo {
        name: DataCenterName;
    }

    export class DataCenterInfoImpl implements EurekaClient.DataCenterInfo {
        @XMLChild
        name: EurekaClient.DataCenterName = 'MyOwn';
        @XMLAttribute
        class: string = '"com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo"';
    }

    export class Metadata {
        constructor(name: string, port: number) {
            this.port = port;
            this.instanceId = name + ':' + port;
        }
        @XMLChild
        instanceId: string;
        @XMLChild({name : 'management.port'})
        port: number;
        @XMLChild({name : 'management.context-path'})
        path = '/management';
    }

    @XMLElement({root: 'applications'})
    export class EurekaConfigImpl {
        constructor(eurekaConfigImpls: EurekaClient.EurekaInstanceConfigImpl[]) {
            this.applications = eurekaConfigImpls;
            this.hashcode = 'UP_' + this.applications.length;
        }

        @XMLChild({name: 'versions__delta'})
        versions = 1;
        @XMLChild({name: 'apps__hashcode'})
        hashcode: string;
        @XMLChild({stripPluralS : true})
        applications: EurekaClient.EurekaInstanceConfigImpl[];
    }

    @XMLElement({root: 'application'})
    export class EurekaInstanceConfigImpl implements EurekaClient.EurekaInstanceConfig {
        constructor(name: string, host: string, port: number) {
            const nameLower = name.toLocaleLowerCase();
            this.hostName = nameLower;
            this.app = name;
            this.ipAddr = host;
            this.status = 'UP';
            this.overriddenstatus = 'UNKNOWN';
            this.port = new PortWrapperImpl(port);
            this.securePort = new PortWrapperImpl(port);
            this.instanceId = host + this.hostName + port;
            this.countryId = 1;
            this.dataCenterInfo = new DataCenterInfoImpl();
            this.leaseInfo = new LeaseInfoImpl();
            this.metadata = new Metadata(name, port);
            this.homePageUrl = 'http://' + host + ':' + port + '/';
            this.statusPageUrl = this.homePageUrl + 'management/info';
            this.healthCheckUrl = this.homePageUrl + 'management/health';
            this.vipAddress = nameLower;
            this.secureVipAddress = this.vipAddress;
            this.isCoordinatingDiscoveryServer = false;
            this.lastDirtyTimestamp = 7258118400000;
            this.lastUpdatedTimestamp = 7258118400000;
            this.actionType = 'ADDED';
        }

        @XMLChild
        app: string;
        @XMLChild
        appGroupName: string;
        @XMLChild
        countryId: number;
        @XMLChild
        dataCenterInfo: DataCenterInfoImpl = new DataCenterInfoImpl();
        @XMLChild
        healthCheckUrl: string;
        @XMLChild
        homePageUrl: string;
        @XMLChild
        hostName: string;
        @XMLChild
        instanceId: string;
        @XMLChild
        ipAddr: string;
        @XMLChild
        isCoordinatingDiscoveryServer: boolean = false;
        @XMLChild
        leaseInfo: EurekaClient.LeaseInfo;
        @XMLChild
        overriddenstatus: EurekaClient.InstanceStatus;
        @XMLChild
        port: EurekaClient.PortWrapper;
        @XMLChild
        securePort: EurekaClient.PortWrapper;
        @XMLChild
        secureHealthCheckUrl: string;
        @XMLChild
        secureVipAddress: string;
        @XMLChild
        sid: string;
        @XMLChild
        status: EurekaClient.InstanceStatus;
        @XMLChild
        statusPageUrl: string;
        @XMLChild
        vipAddress: string;
        @XMLChild
        metadata: Metadata;
        @XMLChild
        lastUpdatedTimestamp: number;
        @XMLChild
        lastDirtyTimestamp: number;
        @XMLChild
        actionType: ActionType;
    }
}
