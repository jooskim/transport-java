import { Component, Input } from '@angular/core';

import { ClrDatagridComparatorInterface, ClrDatagridSortOrder } from '@clr/angular';

import { ChangelogEntry } from './changelog.model';

export class VersionComparator implements ClrDatagridComparatorInterface<ChangelogEntry> {
    compare(a: ChangelogEntry, b: ChangelogEntry) {
        const pa = a.version.split('.');
        const pb = b.version.split('.');
        for (let i = 0; i < 3; i++) {
            let na = Number(pa[i]);
            let nb = Number(pb[i]);
            if (na > nb) return 1;
            if (nb > na) return -1;
            if (!isNaN(na) && isNaN(nb)) return 1;
            if (isNaN(na) && !isNaN(nb)) return -1;
        }
        return 0;
    }
}

@Component({
    selector: 'appfabric-changelog',
    templateUrl: './changelog.component.html',
    styleUrls: ['./changelog.component.scss']
})
export class ChangelogComponent {
    @Input() changelog: Array<ChangelogEntry> = [];

    versionComparator = new VersionComparator();
    ClrDatagridSortOrder = ClrDatagridSortOrder;
}
