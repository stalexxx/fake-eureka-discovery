import { HelloController } from './hello-controller';
import { EurekaController } from './eureka-controller';
import { HelloObjectController } from './hello-object-controller';
import { HelloIocDirectController, HelloIocInterfaceController } from './hello-ioc-controller';
import { HelloServiceBase, HelloServiceImpl, IocHelloService } from './ioc-services';

export default [
  HelloController,
  HelloObjectController,
  EurekaController,

  // The IOC controllers
  HelloIocDirectController,
  HelloIocInterfaceController,

  // Don't forget to load these services, or IOC won't find them.
  IocHelloService,
  HelloServiceBase,
  HelloServiceImpl
];
