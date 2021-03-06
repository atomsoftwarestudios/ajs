/* *************************************************************************
The MIT License (MIT)
Copyright (c)2016-2017 Atom Software Studios. All rights reserved.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to
deal in the Software without restriction, including without limitation the
rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
sell copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
IN THE SOFTWARE.
**************************************************************************** */

namespace ajs.navigation {

    "use strict";

    import Router = ajs.routing.Router;

    export class Navigator {

        protected _lastUrl: string;
        public get lastUrl(): string { return this._lastUrl; }

        protected _redirections: IRedirection[];
        public get redirections(): IRedirection[] { return this._redirections; }

        protected _router: Router;
        public get router(): Router { return this.router; }

        public constructor(router: Router, redirections?: IRedirection[]) {
            this._router = router;
            this._lastUrl = null;
            this._redirections = redirections || [];
            window.addEventListener("popstate", (event: PopStateEvent) => { this._onPopState(event); });
            window.addEventListener("hashchange", (event: HashChangeEvent) => { this._onHashChange(event); });
        }

        public registerRedirection(path: string, target: string) {
            this._redirections.push({
                path: path,
                target: target
            });
        }

        public navigated(): void {
            if (window.location.href !== this._lastUrl) {
                this._lastUrl = window.location.href;
                if (!this._redirect(window.location.pathname)) {
                    this._router.route();
                }
            }
        }

        public navigate(url: string): void {
            if (window.location.href !== url) {
                this._lastUrl = url;
                window.history.pushState({}, "", url);

                if (!this._redirect(url)) {
                    this._router.route();
                }
            }
        }

        protected _onPopState(event: PopStateEvent): void {
            this.navigated();
        }

        protected _onHashChange(event: HashChangeEvent): void {
            this.navigated();
        }

        protected _redirect(url: string): boolean {
            let redirected: boolean = false;

            for (let i: number = 0; i < this._redirections.length; i++) {
                if (this._redirections[i].path === url) {
                    window.history.pushState({}, "", this._redirections[i].target);
                    redirected = true;
                    this._router.route();
                    break;
                }
            }

            return redirected;
        }

    }

}