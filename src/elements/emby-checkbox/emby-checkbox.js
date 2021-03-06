define(['browser', 'dom', 'css!./emby-checkbox', 'registerElement'], function (browser, dom) {
    'use strict';

    var EmbyCheckboxPrototype = Object.create(HTMLInputElement.prototype);

    function onKeyDown(e) {
        // Don't submit form on enter
        // Real (non-emulator) Tizen does nothing on Space
        if (e.keyCode === 13 || e.keyCode === 32) {
            e.preventDefault();

            this.checked = !this.checked;

            this.dispatchEvent(new CustomEvent('change', {
                bubbles: true
            }));

            return false;
        }
    }

    var enableRefreshHack = browser.tizen || browser.orsay || browser.operaTv || browser.web0s ? true : false;

    function forceRefresh(loading) {
        var elem = this.parentNode;

        elem.style.webkitAnimationName = 'repaintChrome';
        elem.style.webkitAnimationDelay = (loading === true ? '500ms' : '');
        elem.style.webkitAnimationDuration = '10ms';
        elem.style.webkitAnimationIterationCount = '1';

        setTimeout(function () {
            elem.style.webkitAnimationName = '';
        }, (loading === true ? 520 : 20));
    }

    EmbyCheckboxPrototype.attachedCallback = function () {
        if (this.getAttribute('data-embycheckbox') === 'true') {
            return;
        }

        this.setAttribute('data-embycheckbox', 'true');

        this.classList.add('emby-checkbox');

        var labelElement = this.parentNode;
        labelElement.classList.add('emby-checkbox-label');

        var labelTextElement = labelElement.querySelector('span');

        var outlineClass = 'checkboxOutline';

        var customClass = this.getAttribute('data-outlineclass');
        if (customClass) {
            outlineClass += ' ' + customClass;
        }

        var checkedIcon = this.getAttribute('data-checkedicon') || 'check';
        var uncheckedIcon = this.getAttribute('data-uncheckedicon') || '';
        var checkHtml = '<span class="material-icons checkboxIcon checkboxIcon-checked ' + checkedIcon + '"></span>';
        var uncheckedHtml = '<span class="material-icons checkboxIcon checkboxIcon-unchecked ' + uncheckedIcon + '"></span>';
        labelElement.insertAdjacentHTML('beforeend', '<span class="' + outlineClass + '">' + checkHtml + uncheckedHtml + '</span>');

        labelTextElement.classList.add('checkboxLabel');

        this.addEventListener('keydown', onKeyDown);

        if (enableRefreshHack) {
            forceRefresh.call(this, true);
            dom.addEventListener(this, 'click', forceRefresh, {
                passive: true
            });
            dom.addEventListener(this, 'blur', forceRefresh, {
                passive: true
            });
            dom.addEventListener(this, 'focus', forceRefresh, {
                passive: true
            });
            dom.addEventListener(this, 'change', forceRefresh, {
                passive: true
            });
        }
    };

    EmbyCheckboxPrototype.detachedCallback = function () {
        this.removeEventListener('keydown', onKeyDown);

        dom.removeEventListener(this, 'click', forceRefresh, {
            passive: true
        });
        dom.removeEventListener(this, 'blur', forceRefresh, {
            passive: true
        });
        dom.removeEventListener(this, 'focus', forceRefresh, {
            passive: true
        });
        dom.removeEventListener(this, 'change', forceRefresh, {
            passive: true
        });
    };

    document.registerElement('emby-checkbox', {
        prototype: EmbyCheckboxPrototype,
        extends: 'input'
    });
});
