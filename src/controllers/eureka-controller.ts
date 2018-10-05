import {Accept, GET, Path, PathParam, POST} from 'typescript-rest';
import {EurekaClient} from '../models/eureka';
import {parse} from 'js2xmlparser';

/**
 * This is a demo operation to show how to use typescript-rest library.
 */

@Path('/eureka/apps')
export class EurekaController {

    @GET
    @Accept('application/xml')
    apps(): string {
        // const app = new EurekaInstanceConfigImpl('sdf', 'localhost', 3479);
        // const config = new EurekaConfigImpl([app]);
        // return xml.serialize(config);
        const obj = {name: 'sdf', host: 'localhost', port: 3479};
        const object = EurekaClient.appsObjects([obj, obj]);
        return parse('applications', object);
    }

    @Path(':appName')
    @POST
    post(@PathParam('name') appName: string): string {
        return parse('ok', '');
    }

    @Path('/delta')
    @GET
    delta(): string {
        // const config = new EurekaConfigImpl([]);
        // return xml.serialize(config);
        return '';
    }
}
