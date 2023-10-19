(function(window, document, $) {
    'use strict';
    var vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', vh + 'px');
    $.app = $.app || {};
    var $body = $('body');
    var $window = $(window);
    var menuWrapper_el = $('div[data-menu="menu-wrapper"]').html();
    var menuWrapperClasses = $('div[data-menu="menu-wrapper"]').attr('class');
    $.app.menu = {
        expanded: null,
        collapsed: null,
        hidden: null,
        container: null,
        horizontalMenu: false,
        is_touch_device: function() {
            var prefixes = ' -webkit- -moz- -o- -ms- '.split(' ');
            var mq = function(query) {
                return window.matchMedia(query).matches;
            };
            if ('ontouchstart' in window || (window.DocumentTouch && document instanceof DocumentTouch)) {
                return true;
            }
            var query = ['(', prefixes.join('touch-enabled),('), 'heartz', ')'].join('');
            return mq(query);
        },
        manualScroller: {
            obj: null,
            init: function() {
                var scroll_theme = $('.main-menu').hasClass('menu-dark') ? 'light' : 'dark';
                if (!$.app.menu.is_touch_device()) {
                    this.obj = new PerfectScrollbar('.main-menu-content', {
                        suppressScrollX: true,
                        wheelPropagation: false
                    });
                } else {
                    $('.main-menu').addClass('menu-native-scroll');
                }
            },
            update: function() {
                if ($('.main-menu').data('scroll-to-active') === true) {
                    var activeEl, menu, activeElHeight;
                    activeEl = document.querySelector('.main-menu-content li.active');
                    menu = document.querySelector('.main-menu-content');
                    if ($body.hasClass('menu-collapsed')) {
                        if ($('.main-menu-content li.sidebar-group-active').length) {
                            activeEl = document.querySelector('.main-menu-content li.sidebar-group-active');
                        }
                    }
                    if (activeEl) {
                        activeElHeight = activeEl.getBoundingClientRect().top + menu.scrollTop;
                    }
                    if (activeElHeight > parseInt((menu.clientHeight * 2) / 3)) {
                        var start = menu.scrollTop,
                            change = activeElHeight - start - parseInt(menu.clientHeight / 2);
                    }
                    setTimeout(function() {
                        $.app.menu.container.stop().animate({
                            scrollTop: change
                        }, 300);
                        $('.main-menu').data('scroll-to-active', 'false');
                    }, 300);
                }
            },
            enable: function() {
                if (!$('.main-menu-content').hasClass('ps')) {
                    this.init();
                }
            },
            disable: function() {
                if (this.obj) {
                    this.obj.destroy();
                }
            },
            updateHeight: function() {
                if (($body.data('menu') == 'vertical-menu' || $body.data('menu') == 'vertical-menu-modern' || $body.data('menu') == 'vertical-overlay-menu') && $('.main-menu').hasClass('menu-fixed')) {
                    $('.main-menu-content').css('height', $(window).height() -
                        $('.header-navbar').height() -
                        $('.main-menu-header').outerHeight() -
                        $('.main-menu-footer').outerHeight());
                    this.update();
                }
            }
        },
        init: function(compactMenu) {
            if ($('.main-menu-content').length > 0) {
                this.container = $('.main-menu-content');
                var menuObj = this;
                this.change(compactMenu);
            }
        },
        change: function(compactMenu) {
            var currentBreakpoint = Unison.fetch.now();
            this.reset();
            var menuType = $body.data('menu');
            if (currentBreakpoint) {
                switch (currentBreakpoint.name) {
                    case 'xl':
                        if (menuType === 'vertical-overlay-menu') {
                            this.hide();
                        } else {
                            if (compactMenu === true) this.collapse(compactMenu);
                            else this.expand();
                        }
                        break;
                    case 'lg':
                        if (menuType === 'vertical-overlay-menu' || menuType === 'vertical-menu-modern' || menuType === 'horizontal-menu') {
                            this.hide();
                        } else {
                            this.collapse();
                        }
                        break;
                    case 'md':
                    case 'sm':
                        this.hide();
                        break;
                    case 'xs':
                        this.hide();
                        break;
                }
            }
            if (menuType === 'vertical-menu' || menuType === 'vertical-menu-modern') {
                this.toOverlayMenu(currentBreakpoint.name, menuType);
            }
            if ($body.is('.horizontal-layout') && !$body.hasClass('.horizontal-menu-demo')) {
                this.changeMenu(currentBreakpoint.name);
                $('.menu-toggle').removeClass('is-active');
            }
            if (currentBreakpoint.name == 'xl') {
                $('body[data-open="hover"] .main-menu-content .dropdown').on('mouseenter', function() {
                    if (!$(this).hasClass('show')) {
                        $(this).addClass('show');
                    } else {
                        $(this).removeClass('show');
                    }
                }).on('mouseleave', function(event) {
                    $(this).removeClass('show');
                });
            }
            if (currentBreakpoint.name == 'sm' || currentBreakpoint.name == 'xs') {
                $('.header-navbar[data-nav=brand-center]').removeClass('navbar-brand-center');
            } else {
                $('.header-navbar[data-nav=brand-center]').addClass('navbar-brand-center');
            }
            if (currentBreakpoint.name == 'xl' && menuType == 'horizontal-menu') {
                $('.main-menu-content').find('li.active').parents('li').addClass('sidebar-group-active active');
            }
            if (currentBreakpoint.name !== 'xl' && menuType == 'horizontal-menu') {
                $('#navbar-type').toggleClass('d-none d-xl-block');
            }
            $('ul.dropdown-menu [data-bs-toggle=dropdown]').on('click', function(event) {
                if ($(this).siblings('ul.dropdown-menu').length > 0) {
                    event.preventDefault();
                }
                event.stopPropagation();
                $(this).parent().siblings().removeClass('show');
                $(this).parent().toggleClass('show');
            });
            if (menuType == 'horizontal-menu') {
                $('li.dropdown-submenu').on('mouseenter', function() {
                    if (!$(this).parent('.dropdown').hasClass('show')) {
                        $(this).removeClass('openLeft');
                    }
                    var dd = $(this).find('.dropdown-menu');
                    if (dd) {
                        var pageHeight = $(window).height(),
                            ddTop = $(this).position().top,
                            ddLeft = dd.offset().left,
                            ddWidth = dd.width(),
                            ddHeight = dd.height();
                        if (pageHeight - ddTop - ddHeight - 28 < 1) {
                            var maxHeight = pageHeight - ddTop - 170;
                            $(this).find('.dropdown-menu').css({
                                'max-height': maxHeight + 'px',
                                'overflow-y': 'auto',
                                'overflow-x': 'hidden'
                            });
                            var menu_content = new PerfectScrollbar('li.dropdown-submenu.show .dropdown-menu', {
                                wheelPropagation: false
                            });
                        }
                        if (ddLeft + ddWidth - (window.innerWidth - 16) >= 0) {
                            $(this).addClass('openLeft');
                        }
                    }
                });
                $('.theme-layouts').find('.semi-dark').hide();
            }
        },
        transit: function(callback1, callback2) {
            var menuObj = this;
            $body.addClass('changing-menu');
            callback1.call(menuObj);
            if ($body.hasClass('vertical-layout')) {
                if ($body.hasClass('menu-open') || $body.hasClass('menu-expanded')) {
                    $('.menu-toggle').addClass('is-active');
                    if ($body.data('menu') === 'vertical-menu') {
                        if ($('.main-menu-header')) {
                            $('.main-menu-header').show();
                        }
                    }
                } else {
                    $('.menu-toggle').removeClass('is-active');
                    if ($body.data('menu') === 'vertical-menu') {
                        if ($('.main-menu-header')) {
                            $('.main-menu-header').hide();
                        }
                    }
                }
            }
            setTimeout(function() {
                callback2.call(menuObj);
                $body.removeClass('changing-menu');
                menuObj.update();
            }, 500);
        },
        open: function() {
            this.transit(function() {
                $body.removeClass('menu-hide menu-collapsed').addClass('menu-open');
                this.hidden = false;
                this.expanded = true;
                if ($body.hasClass('vertical-overlay-menu')) {
                    $('.sidenav-overlay').addClass('show');
                }
            }, function() {
                if (!$('.main-menu').hasClass('menu-native-scroll') && $('.main-menu').hasClass('menu-fixed')) {
                    this.manualScroller.enable();
                    $('.main-menu-content').css('height', $(window).height() -
                        $('.header-navbar').height() -
                        $('.main-menu-header').outerHeight() -
                        $('.main-menu-footer').outerHeight());
                }
                if (!$body.hasClass('vertical-overlay-menu')) {
                    $('.sidenav-overlay').removeClass('show');
                }
            });
        },
        hide: function() {
            this.transit(function() {
                $body.removeClass('menu-open menu-expanded').addClass('menu-hide');
                this.hidden = true;
                this.expanded = false;
                if ($body.hasClass('vertical-overlay-menu')) {
                    $('.sidenav-overlay').removeClass('show');
                }
            }, function() {
                if (!$('.main-menu').hasClass('menu-native-scroll') && $('.main-menu').hasClass('menu-fixed')) {
                    this.manualScroller.enable();
                }
                if (!$body.hasClass('vertical-overlay-menu')) {
                    $('.sidenav-overlay').removeClass('show');
                }
            });
        },
        expand: function() {
            if (this.expanded === false) {
                if ($body.data('menu') == 'vertical-menu-modern') {
                    $('.modern-nav-toggle').find('.collapse-toggle-icon').replaceWith(feather.icons['disc'].toSvg({
                        class: 'd-none d-xl-block collapse-toggle-icon primary font-medium-4'
                    }));
                }
                this.transit(function() {
                    $body.removeClass('menu-collapsed').addClass('menu-expanded');
                    this.collapsed = false;
                    this.expanded = true;
                    $('.sidenav-overlay').removeClass('show');
                }, function() {
                    if ($('.main-menu').hasClass('menu-native-scroll') || $body.data('menu') == 'horizontal-menu') {
                        this.manualScroller.disable();
                    } else {
                        if ($('.main-menu').hasClass('menu-fixed')) this.manualScroller.enable();
                    }
                    if (($body.data('menu') == 'vertical-menu' || $body.data('menu') == 'vertical-menu-modern') && $('.main-menu').hasClass('menu-fixed')) {
                        $('.main-menu-content').css('height', $(window).height() -
                            $('.header-navbar').height() -
                            $('.main-menu-header').outerHeight() -
                            $('.main-menu-footer').outerHeight());
                    }
                });
            }
        },
        collapse: function() {
            if (this.collapsed === false) {
                if ($body.data('menu') == 'vertical-menu-modern') {
                    $('.modern-nav-toggle').find('.collapse-toggle-icon').replaceWith(feather.icons['circle'].toSvg({
                        class: 'd-none d-xl-block collapse-toggle-icon primary font-medium-4'
                    }));
                }
                this.transit(function() {
                    $body.removeClass('menu-expanded').addClass('menu-collapsed');
                    this.collapsed = true;
                    this.expanded = false;
                    $('.content-overlay').removeClass('d-block d-none');
                }, function() {
                    if ($body.data('menu') == 'horizontal-menu' && $body.hasClass('vertical-overlay-menu')) {
                        if ($('.main-menu').hasClass('menu-fixed')) this.manualScroller.enable();
                    }
                    if (($body.data('menu') == 'vertical-menu' || $body.data('menu') == 'vertical-menu-modern') && $('.main-menu').hasClass('menu-fixed')) {
                        $('.main-menu-content').css('height', $(window).height() - $('.header-navbar').height());
                    }
                    if ($body.data('menu') == 'vertical-menu-modern') {
                        if ($('.main-menu').hasClass('menu-fixed')) this.manualScroller.enable();
                    }
                });
            }
        },
        toOverlayMenu: function(screen, menuType) {
            var menu = $body.data('menu');
            if (menuType == 'vertical-menu-modern') {
                if (screen == 'lg' || screen == 'md' || screen == 'sm' || screen == 'xs') {
                    if ($body.hasClass(menu)) {
                        $body.removeClass(menu).addClass('vertical-overlay-menu');
                    }
                } else {
                    if ($body.hasClass('vertical-overlay-menu')) {
                        $body.removeClass('vertical-overlay-menu').addClass(menu);
                    }
                }
            } else {
                if (screen == 'sm' || screen == 'xs') {
                    if ($body.hasClass(menu)) {
                        $body.removeClass(menu).addClass('vertical-overlay-menu');
                    }
                } else {
                    if ($body.hasClass('vertical-overlay-menu')) {
                        $body.removeClass('vertical-overlay-menu').addClass(menu);
                    }
                }
            }
        },
        changeMenu: function(screen) {
            $('div[data-menu="menu-wrapper"]').html('');
            $('div[data-menu="menu-wrapper"]').html(menuWrapper_el);
            var menuWrapper = $('div[data-menu="menu-wrapper"]'),
                menuContainer = $('div[data-menu="menu-container"]'),
                menuNavigation = $('ul[data-menu="menu-navigation"]'),
                dropdownMenu = $('li[data-menu="dropdown"]'),
                dropdownSubMenu = $('li[data-menu="dropdown-submenu"]');
            if (screen === 'xl') {
                $body.removeClass('vertical-layout vertical-overlay-menu fixed-navbar').addClass($body.data('menu'));
                $('nav.header-navbar').removeClass('fixed-top');
                menuWrapper.removeClass().addClass(menuWrapperClasses);
                $('a.dropdown-item.nav-has-children').on('click', function() {
                    event.preventDefault();
                    event.stopPropagation();
                });
                $('a.dropdown-item.nav-has-parent').on('click', function() {
                    event.preventDefault();
                    event.stopPropagation();
                });
            } else {
                $body.removeClass($body.data('menu')).addClass('vertical-layout vertical-overlay-menu fixed-navbar');
                $('nav.header-navbar').addClass('fixed-top');
                menuWrapper.removeClass().addClass('main-menu menu-light menu-fixed menu-shadow');
                menuNavigation.removeClass().addClass('navigation navigation-main');
                dropdownMenu.removeClass('dropdown').addClass('has-sub');
                dropdownMenu.find('a').removeClass('dropdown-toggle nav-link');
                dropdownMenu.find('a').attr('data-bs-toggle', '');
                dropdownMenu.children('ul').find('a').removeClass('dropdown-item');
                dropdownMenu.find('ul').removeClass('dropdown-menu');
                dropdownSubMenu.removeClass().addClass('has-sub');
                $.app.nav.init();
                $('ul.dropdown-menu [data-bs-toggle=dropdown]').on('click', function(event) {
                    event.preventDefault();
                    event.stopPropagation();
                    $(this).parent().siblings().removeClass('open');
                    $(this).parent().toggleClass('open');
                });
                $('.main-menu-content').find('li.active').parents('li').addClass('sidebar-group-active');
                $('.main-menu-content').find('li.active').closest('li.nav-item').addClass('open');
            }
            if (feather) {
                feather.replace({
                    width: 14,
                    height: 14
                });
            }
        },
        toggle: function() {
            var currentBreakpoint = Unison.fetch.now();
            var collapsed = this.collapsed;
            var expanded = this.expanded;
            var hidden = this.hidden;
            var menu = $body.data('menu');
            switch (currentBreakpoint.name) {
                case 'xl':
                    if (expanded === true) {
                        if (menu == 'vertical-overlay-menu') {
                            this.hide();
                        } else {
                            this.collapse();
                        }
                    } else {
                        if (menu == 'vertical-overlay-menu') {
                            this.open();
                        } else {
                            this.expand();
                        }
                    }
                    break;
                case 'lg':
                    if (expanded === true) {
                        if (menu == 'vertical-overlay-menu' || menu == 'vertical-menu-modern' || menu == 'horizontal-menu') {
                            this.hide();
                        } else {
                            this.collapse();
                        }
                    } else {
                        if (menu == 'vertical-overlay-menu' || menu == 'vertical-menu-modern' || menu == 'horizontal-menu') {
                            this.open();
                        } else {
                            this.expand();
                        }
                    }
                    break;
                case 'md':
                case 'sm':
                    if (hidden === true) {
                        this.open();
                    } else {
                        this.hide();
                    }
                    break;
                case 'xs':
                    if (hidden === true) {
                        this.open();
                    } else {
                        this.hide();
                    }
                    break;
            }
        },
        update: function() {
            this.manualScroller.update();
        },
        reset: function() {
            this.expanded = false;
            this.collapsed = false;
            this.hidden = false;
            $body.removeClass('menu-hide menu-open menu-collapsed menu-expanded');
        }
    };
    $.app.nav = {
        container: $('.navigation-main'),
        initialized: false,
        navItem: $('.navigation-main').find('li').not('.navigation-category'),
        TRANSITION_EVENTS: ['transitionend', 'webkitTransitionEnd', 'oTransitionEnd'],
        TRANSITION_PROPERTIES: ['transition', 'MozTransition', 'webkitTransition', 'WebkitTransition', 'OTransition'],
        config: {
            speed: 300
        },
        init: function(config) {
            this.initialized = true;
            $.extend(this.config, config);
            this.bind_events();
        },
        bind_events: function() {
            var menuObj = this;
            $('.navigation-main').on('mouseenter.app.menu', 'li', function() {
                var $this = $(this);
                if ($body.hasClass('menu-collapsed') && $body.data('menu') != 'vertical-menu-modern') {
                    $('.main-menu-content').children('span.menu-title').remove();
                    $('.main-menu-content').children('a.menu-title').remove();
                    $('.main-menu-content').children('ul.menu-content').remove();
                    var menuTitle = $this.find('span.menu-title').clone(),
                        tempTitle, tempLink;
                    if (!$this.hasClass('has-sub')) {
                        tempTitle = $this.find('span.menu-title').text();
                        tempLink = $this.children('a').attr('href');
                        if (tempTitle !== '') {
                            menuTitle = $('<a>');
                            menuTitle.attr('href', tempLink);
                            menuTitle.attr('title', tempTitle);
                            menuTitle.text(tempTitle);
                            menuTitle.addClass('menu-title');
                        }
                    }
                    var fromTop;
                    if ($this.css('border-top')) {
                        fromTop = $this.position().top + parseInt($this.css('border-top'), 10);
                    } else {
                        fromTop = $this.position().top;
                    }
                    if ($body.data('menu') !== 'vertical-compact-menu') {
                        menuTitle.appendTo('.main-menu-content').css({
                            position: 'fixed',
                            top: fromTop
                        });
                    }
                }
            }).on('mouseleave.app.menu', 'li', function() {}).on('active.app.menu', 'li', function(e) {
                $(this).addClass('active');
                e.stopPropagation();
            }).on('deactive.app.menu', 'li.active', function(e) {
                $(this).removeClass('active');
                e.stopPropagation();
            }).on('open.app.menu', 'li', function(e) {
                var $listItem = $(this);
                menuObj.expand($listItem);
                if ($('.main-menu').hasClass('menu-collapsible')) {
                    return false;
                } else {
                    $listItem.siblings('.open').find('li.open').trigger('close.app.menu');
                    $listItem.siblings('.open').trigger('close.app.menu');
                }
                e.stopPropagation();
            }).on('close.app.menu', 'li.open', function(e) {
                var $listItem = $(this);
                menuObj.collapse($listItem);
                e.stopPropagation();
            }).on('click.app.menu', 'li', function(e) {
                var $listItem = $(this);
                if ($listItem.is('.disabled')) {
                    e.preventDefault();
                } else {
                    if ($body.hasClass('menu-collapsed') && $body.data('menu') != 'vertical-menu-modern') {
                        e.preventDefault();
                    } else {
                        if ($listItem.has('ul').length) {
                            if ($listItem.is('.open')) {
                                $listItem.trigger('close.app.menu');
                            } else {
                                $listItem.trigger('open.app.menu');
                            }
                        } else {
                            if (!$listItem.is('.active')) {
                                $listItem.siblings('.active').trigger('deactive.app.menu');
                                $listItem.trigger('active.app.menu');
                            }
                        }
                    }
                }
                e.stopPropagation();
            });
            $('.navbar-header, .main-menu').on('mouseenter', modernMenuExpand).on('mouseleave', modernMenuCollapse);

            function modernMenuExpand() {
                if ($body.data('menu') == 'vertical-menu-modern') {
                    $('.main-menu, .navbar-header').addClass('expanded');
                    if ($body.hasClass('menu-collapsed')) {
                        if ($('.main-menu li.open').length === 0) {
                            $('.main-menu-content').find('li.active').parents('li').addClass('open');
                        }
                        var $listItem = $('.main-menu li.menu-collapsed-open'),
                            $subList = $listItem.children('ul');
                        $subList.hide().slideDown(200, function() {
                            $(this).css('display', '');
                        });
                        $listItem.addClass('open').removeClass('menu-collapsed-open');
                    }
                }
            }

            function modernMenuCollapse() {
                if ($body.hasClass('menu-collapsed') && $body.data('menu') == 'vertical-menu-modern') {
                    setTimeout(function() {
                        if ($('.main-menu:hover').length === 0 && $('.navbar-header:hover').length === 0) {
                            $('.main-menu, .navbar-header').removeClass('expanded');
                            if ($body.hasClass('menu-collapsed')) {
                                var $listItem = $('.main-menu li.open'),
                                    $subList = $listItem.children('ul');
                                $listItem.addClass('menu-collapsed-open');
                                $subList.show().slideUp(200, function() {
                                    $(this).css('display', '');
                                });
                                $listItem.removeClass('open');
                            }
                        }
                    }, 1);
                }
            }
            $('.main-menu-content').on('mouseleave', function() {
                if ($body.hasClass('menu-collapsed')) {
                    $('.main-menu-content').children('span.menu-title').remove();
                    $('.main-menu-content').children('a.menu-title').remove();
                    $('.main-menu-content').children('ul.menu-content').remove();
                }
                $('.hover', '.navigation-main').removeClass('hover');
            });
            $('.navigation-main li.has-sub > a').on('click', function(e) {
                e.preventDefault();
            });
        },
        collapse: function($listItem, callback) {
            var subList = $listItem.children('ul'),
                toggleLink = $listItem.children().first(),
                linkHeight = $(toggleLink).outerHeight();
            $listItem.css({
                height: linkHeight + subList.outerHeight() + 'px',
                overflow: 'hidden'
            });
            $listItem.addClass('menu-item-animating');
            $listItem.addClass('menu-item-closing');
            $.app.nav._bindAnimationEndEvent($listItem, function() {
                $listItem.removeClass('open');
                $.app.nav._clearItemStyle($listItem);
            });
            setTimeout(function() {
                $listItem.css({
                    height: linkHeight + 'px'
                });
            }, 50);
        },
        expand: function($listItem, callback) {
            var subList = $listItem.children('ul'),
                toggleLink = $listItem.children().first(),
                linkHeight = $(toggleLink).outerHeight();
            $listItem.addClass('menu-item-animating');
            $listItem.css({
                overflow: 'hidden',
                height: linkHeight + 'px'
            });
            $listItem.addClass('open');
            $.app.nav._bindAnimationEndEvent($listItem, function() {
                $.app.nav._clearItemStyle($listItem);
            });
            setTimeout(function() {
                $listItem.css({
                    height: linkHeight + subList.outerHeight() + 'px'
                });
            }, 50);
        },
        _bindAnimationEndEvent(el, handler) {
            el = el[0];
            var cb = function(e) {
                if (e.target !== el) return;
                $.app.nav._unbindAnimationEndEvent(el);
                handler(e);
            };
            let duration = window.getComputedStyle(el).transitionDuration;
            duration = parseFloat(duration) * (duration.indexOf('ms') !== -1 ? 1 : 1000);
            el._menuAnimationEndEventCb = cb;
            $.app.nav.TRANSITION_EVENTS.forEach(function(ev) {
                el.addEventListener(ev, el._menuAnimationEndEventCb, false);
            });
            el._menuAnimationEndEventTimeout = setTimeout(function() {
                cb({
                    target: el
                });
            }, duration + 50);
        },
        _unbindAnimationEndEvent(el) {
            var cb = el._menuAnimationEndEventCb;
            if (el._menuAnimationEndEventTimeout) {
                clearTimeout(el._menuAnimationEndEventTimeout);
                el._menuAnimationEndEventTimeout = null;
            }
            if (!cb) return;
            $.app.nav.TRANSITION_EVENTS.forEach(function(ev) {
                el.removeEventListener(ev, cb, false);
            });
            el._menuAnimationEndEventCb = null;
        },
        _clearItemStyle: function($listItem) {
            $listItem.removeClass('menu-item-animating');
            $listItem.removeClass('menu-item-closing');
            $listItem.css({
                overflow: '',
                height: ''
            });
        },
        refresh: function() {
            $.app.nav.container.find('.open').removeClass('open');
        }
    };
    $(document).on('click', 'a[href="#"]', function(e) {
        e.preventDefault();
    });
})(window, document, jQuery);
window.addEventListener('resize', function() {
    var vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', vh + 'px');
});