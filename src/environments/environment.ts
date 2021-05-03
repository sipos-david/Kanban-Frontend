// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  app: {
    url: {
      dashboard: 'http://localhost:4200/dashboard',
    },
  },
  api: {
    v1: {
      cache: {
        project: {
          all: 'v1-project-all',
          id: 'v1-project-id-',
        },
        user: {
          all: 'v1-user-all',
          id: 'v1-user-id-',
        },
      },
      url: {
        project: 'http://localhost:5000/api/v1.0/projects',
        user: 'http://localhost:5000/api/v1.0/users',
      },
    },
  },
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
