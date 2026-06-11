import { Injectable, inject } from '@angular/core';
import { AuthService } from './auth.service';
import { RequestType } from '../enums/request-type.enum';

import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ContactSalesService {

    private auth = inject(AuthService);

    private readonly salesPhone = environment.supportWhatsapp;

    requestInformation(type: RequestType): void {

        const organization =
            this.auth.organization$();

        const branch =
            this.auth.currentBranch$();

        let message = '';

        switch (type) {

            case RequestType.WEBSITE:

                message =
                    `Hola.

Me interesa obtener información sobre una página web profesional para mi negocio.

Organización: ${organization?.name ?? 'N/A'}
Sucursal: ${branch?.branch_name ?? 'N/A'}

Gracias.`;

                break;

            case RequestType.UPGRADE_PLAN:

                message =
                    `Hola.

Me interesa cambiar mi plan de ROMBI.

Organización: ${organization?.name ?? 'N/A'}
Sucursal: ${branch?.name ?? 'N/A'}

Gracias.`;

                break;

            case RequestType.CUSTOM_SETUP:

                message =
                    `Hola.

Me interesa obtener información sobre una configuración personalizada de ROMBI.

Organización: ${organization?.name ?? 'N/A'}
Sucursal: ${branch?.name ?? 'N/A'}

Gracias.`;

                break;

            default:

                message =
                    `Hola.

Me gustaría obtener más información sobre ROMBI.

Organización: ${organization?.name ?? 'N/A'}
Sucursal: ${branch?.name ?? 'N/A'}

Gracias.`;
        }

        const url =
            `https://wa.me/${this.salesPhone}?text=${encodeURIComponent(message)}`;

        window.open(url, '_blank');
    }
}