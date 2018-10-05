import {Accept, GET, Path, PathParam, POST} from 'typescript-rest';
import {xml} from 'xml-decorators';
import {EurekaClient} from '../models/eureka';
import EurekaInstanceConfigImpl = EurekaClient.EurekaInstanceConfigImpl;
import EurekaConfigImpl = EurekaClient.EurekaConfigImpl;

// XMLChild

/**
 * This is a demo operation to show how to use typescript-rest library.
 */
@Path('/eureka/apps')
export class EurekaController {

    @GET
    @Accept('application/xml')
    apps(): string {
        const app = new EurekaInstanceConfigImpl('sdf', 'localhost', 3479);
        const config = new EurekaConfigImpl([app]);
        return xml.serialize(config);
    }

    @Path(':appName')
    @POST
    post(@PathParam('name') appName: string): string {
        return xml.serialize(appName);
    }

    @Path('/delta')
    @GET
    delta(): string {
        const config = new EurekaConfigImpl([]);
        return xml.serialize(config);
    }
}
