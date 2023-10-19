window.colors = {
    solid: {
        primary: '#7367F0',
        secondary: '#82868b',
        success: '#28C76F',
        info: '#00cfe8',
        warning: '#FF9F43',
        danger: '#EA5455',
        dark: '#4b4b4b',
        black: '#000',
        white: '#fff',
        body: '#f8f8f8'
    },
    light: {
        primary: '#7367F01a',
        secondary: '#82868b1a',
        success: '#28C76F1a',
        info: '#00cfe81a',
        warning: '#FF9F431a',
        danger: '#EA54551a',
        dark: '#4b4b4b1a'
    }
};
(function(window, document, $) {
    'use strict';
    var $html = $('html');
    var $body = $('body');
    var $textcolor = '#4e5154';
    var assetPath = '../../../app-assets/';
    if ($('body').attr('data-framework') === 'laravel') {
        assetPath = $('body').attr('data-asset-path');
    }
    if ($.fn.dataTable) {
        $.extend($.fn.dataTable.ext.classes, {
            sFilterInput: 'form-control',
            sLengthSelect: 'form-select'
        });
    }
    $(window).on('load', function() {
        var rtl;
        var compactMenu = false;
        if ($body.hasClass('menu-collapsed') || localStorage.getItem('menuCollapsed') === 'true') {
            compactMenu = true;
        }
        if ($('html').data('textdirection') == 'rtl') {
            rtl = true;
        }
        setTimeout(function() {
            $html.removeClass('loading').addClass('loaded');
        }, 1200);
        $.app.menu.init(compactMenu);
        var config = {
            speed: 300
        };
        if ($.app.nav.initialized === false) {
            $.app.nav.init(config);
        }
        Unison.on('change', function(bp) {
            $.app.menu.change(compactMenu);
        });
        var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        var tooltipList = tooltipTriggerList.map(function(tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });
        $('a[data-action="collapse"]').on('click', function(e) {
            e.preventDefault();
            $(this).closest('.card').children('.card-content').collapse('toggle');
            $(this).closest('.card').find('[data-action="collapse"]').toggleClass('rotate');
        });
        if ($('.touchspin-cart').length > 0) {
            $('.touchspin-cart').TouchSpin({
                buttondown_class: 'btn btn-primary',
                buttonup_class: 'btn btn-primary',
                buttondown_txt: feather.icons['minus'].toSvg(),
                buttonup_txt: feather.icons['plus'].toSvg()
            });
        }
        $('.dropdown-notification .dropdown-menu, .dropdown-cart .dropdown-menu').on('click', function(e) {
            e.stopPropagation();
        });
        $('.scrollable-container').each(function() {
            var scrollable_container = new PerfectScrollbar($(this)[0], {
                wheelPropagation: false
            });
        });
        $('a[data-action="reload"]').on('click', function() {
            var block_ele = $(this).closest('.card');
            var reloadActionOverlay;
            if ($html.hasClass('dark-layout')) {
                var reloadActionOverlay = '#10163a';
            } else {
                var reloadActionOverlay = '#fff';
            }
            block_ele.block({
                message: feather.icons['refresh-cw'].toSvg({
                    class: 'font-medium-1 spinner text-primary'
                }),
                timeout: 2000,
                overlayCSS: {
                    backgroundColor: reloadActionOverlay,
                    cursor: 'wait'
                },
                css: {
                    border: 0,
                    padding: 0,
                    backgroundColor: 'none'
                }
            });
        });
        $('a[data-action="close"]').on('click', function() {
            $(this).closest('.card').removeClass().slideUp('fast');
        });
        $('.card .heading-elements a[data-action="collapse"]').on('click', function() {
            var $this = $(this),
                card = $this.closest('.card');
            var cardHeight;
            if (parseInt(card[0].style.height, 10) > 0) {
                cardHeight = card.css('height');
                card.css('height', '').attr('data-height', cardHeight);
            } else {
                if (card.data('height')) {
                    cardHeight = card.data('height');
                    card.css('height', cardHeight).attr('data-height', '');
                }
            }
        });
        $('input:disabled, textarea:disabled').closest('.input-group').addClass('disabled');
        $('.main-menu-content').find('li.active').parents('li').addClass('sidebar-group-active');
        var menuType = $body.data('menu');
        if (menuType != 'horizontal-menu' && compactMenu === false) {
            $('.main-menu-content').find('li.active').parents('li').addClass('open');
        }
        if (menuType == 'horizontal-menu') {
            $('.main-menu-content').find('li.active').parents('li:not(.nav-item)').addClass('open');
            $('.main-menu-content').find('li.active').closest('li.nav-item').addClass('sidebar-group-active open');
        }
        var chartjsDiv = $('.chartjs'),
            canvasHeight = chartjsDiv.children('canvas').attr('height'),
            mainMenu = $('.main-menu');
        chartjsDiv.css('height', canvasHeight);
        if ($body.hasClass('boxed-layout')) {
            if ($body.hasClass('vertical-overlay-menu')) {
                var menuWidth = mainMenu.width();
                var contentPosition = $('.app-content').position().left;
                var menuPositionAdjust = contentPosition - menuWidth;
                if ($body.hasClass('menu-flipped')) {
                    mainMenu.css('right', menuPositionAdjust + 'px');
                } else {
                    mainMenu.css('left', menuPositionAdjust + 'px');
                }
            }
        }
        $('.char-textarea').on('keyup', function(event) {
            checkTextAreaMaxLength(this, event);
            $(this).addClass('active');
        });

        function checkTextAreaMaxLength(textBox, e) {
            var maxLength = parseInt($(textBox).data('length')),
                counterValue = $('.textarea-counter-value'),
                charTextarea = $('.char-textarea');
            if (!checkSpecialKeys(e)) {
                if (textBox.value.length < maxLength - 1) textBox.value = textBox.value.substring(0, maxLength);
            }
            $('.char-count').html(textBox.value.length);
            if (textBox.value.length > maxLength) {
                counterValue.css('background-color', window.colors.solid.danger);
                charTextarea.css('color', window.colors.solid.danger);
                charTextarea.addClass('max-limit');
            } else {
                counterValue.css('background-color', window.colors.solid.primary);
                charTextarea.css('color', $textcolor);
                charTextarea.removeClass('max-limit');
            }
            return true;
        }

        function checkSpecialKeys(e) {
            if (e.keyCode != 8 && e.keyCode != 46 && e.keyCode != 37 && e.keyCode != 38 && e.keyCode != 39 && e.keyCode != 40)
                return false;
            else return true;
        }
        $('.content-overlay').on('click', function() {
            $('.search-list').removeClass('show');
            var searchInput = $('.search-input-close').closest('.search-input');
            if (searchInput.hasClass('open')) {
                searchInput.removeClass('open');
                searchInputInputfield.val('');
                searchInputInputfield.blur();
                searchList.removeClass('show');
            }
            $('.app-content').removeClass('show-overlay');
            $('.bookmark-wrapper .bookmark-input').removeClass('show');
        });
        var container = document.getElementsByClassName('main-menu-content');
        if (container.length > 0) {
            container[0].addEventListener('ps-scroll-y', function() {
                if ($(this).find('.ps__thumb-y').position().top > 0) {
                    $('.shadow-bottom').css('display', 'block');
                } else {
                    $('.shadow-bottom').css('display', 'none');
                }
            });
        }
    });
    $(document).on('click', '.sidenav-overlay', function(e) {
        $.app.menu.hide();
        return false;
    });
    if (typeof Hammer !== 'undefined') {
        var rtl;
        if ($('html').data('textdirection') == 'rtl') {
            rtl = true;
        }
        var swipeInElement = document.querySelector('.drag-target'),
            swipeInAction = 'panright',
            swipeOutAction = 'panleft';
        if (rtl === true) {
            swipeInAction = 'panleft';
            swipeOutAction = 'panright';
        }
        if ($(swipeInElement).length > 0) {
            var swipeInMenu = new Hammer(swipeInElement);
            swipeInMenu.on(swipeInAction, function(ev) {
                if ($body.hasClass('vertical-overlay-menu')) {
                    $.app.menu.open();
                    return false;
                }
            });
        }
        setTimeout(function() {
            var swipeOutElement = document.querySelector('.main-menu');
            var swipeOutMenu;
            if ($(swipeOutElement).length > 0) {
                swipeOutMenu = new Hammer(swipeOutElement);
                swipeOutMenu.get('pan').set({
                    direction: Hammer.DIRECTION_ALL,
                    threshold: 250
                });
                swipeOutMenu.on(swipeOutAction, function(ev) {
                    if ($body.hasClass('vertical-overlay-menu')) {
                        $.app.menu.hide();
                        return false;
                    }
                });
            }
        }, 300);
        var swipeOutOverlayElement = document.querySelector('.sidenav-overlay');
        if ($(swipeOutOverlayElement).length > 0) {
            var swipeOutOverlayMenu = new Hammer(swipeOutOverlayElement);
            swipeOutOverlayMenu.on('tap', function(ev) {
                if ($body.hasClass('vertical-overlay-menu')) {
                    $.app.menu.hide();
                    return false;
                }
            });
        }
    }
    $(document).on('click', '.menu-toggle, .modern-nav-toggle', function(e) {
        e.preventDefault();
        $.app.menu.toggle();
        setTimeout(function() {
            $(window).trigger('resize');
        }, 200);
        if ($('#collapse-sidebar-switch').length > 0) {
            setTimeout(function() {
                if ($body.hasClass('menu-expanded') || $body.hasClass('menu-open')) {
                    $('#collapse-sidebar-switch').prop('checked', false);
                } else {
                    $('#collapse-sidebar-switch').prop('checked', true);
                }
            }, 50);
        }
        if ($body.hasClass('menu-expanded') || $body.hasClass('menu-open')) {
            localStorage.setItem('menuCollapsed', false);
        } else {
            localStorage.setItem('menuCollapsed', true);
        }
        return false;
    });
    $('.navigation').find('li').has('ul').addClass('has-sub');
    $(window).resize(function() {
        $.app.menu.manualScroller.updateHeight();
    });
    $('#sidebar-page-navigation').on('click', 'a.nav-link', function(e) {
        e.preventDefault();
        e.stopPropagation();
        var $this = $(this),
            href = $this.attr('href');
        var offset = $(href).offset();
        var scrollto = offset.top - 80;
        $('html, body').animate({
            scrollTop: scrollto
        }, 0);
        setTimeout(function() {
            $this.parent('.nav-item').siblings('.nav-item').children('.nav-link').removeClass('active');
            $this.addClass('active');
        }, 100);
    });
    if ($body.attr('data-framework') === 'laravel') {
        var language = $('html')[0].lang;
        if (language !== null) {
            var selectedLang = $('.dropdown-language').find('a[data-language=' + language + ']').text();
            var selectedFlag = $('.dropdown-language').find('a[data-language=' + language + '] .flag-icon').attr('class');
            $('#dropdown-flag .selected-language').text(selectedLang);
            $('#dropdown-flag .flag-icon').removeClass().addClass(selectedFlag);
        }
    } else {
        i18next.use(window.i18nextXHRBackend).init({
            debug: false,
            fallbackLng: 'en',
            backend: {
                loadPath: assetPath + 'data/locales/{{lng}}.json'
            },
            returnObjects: true
        }, function(err, t) {
            jqueryI18next.init(i18next, $);
        });
        $('.dropdown-language .dropdown-item').on('click', function() {
            var $this = $(this);
            $this.siblings('.selected').removeClass('selected');
            $this.addClass('selected');
            var selectedLang = $this.text();
            var selectedFlag = $this.find('.flag-icon').attr('class');
            $('#dropdown-flag .selected-language').text(selectedLang);
            $('#dropdown-flag .flag-icon').removeClass().addClass(selectedFlag);
            var currentLanguage = $this.data('language');
            i18next.changeLanguage(currentLanguage, function(err, t) {
                $('.main-menu, .horizontal-menu-wrapper').localize();
            });
        });
    }
    var $filename = $('.search-input input').data('search'),
        bookmarkWrapper = $('.bookmark-wrapper'),
        bookmarkStar = $('.bookmark-wrapper .bookmark-star'),
        bookmarkInput = $('.bookmark-wrapper .bookmark-input'),
        navLinkSearch = $('.nav-link-search'),
        searchInput = $('.search-input'),
        searchInputInputfield = $('.search-input input'),
        searchList = $('.search-input .search-list'),
        appContent = $('.app-content'),
        bookmarkSearchList = $('.bookmark-input .search-list');
    bookmarkStar.on('click', function(e) {
        e.stopPropagation();
        bookmarkInput.toggleClass('show');
        bookmarkInput.find('input').val('');
        bookmarkInput.find('input').blur();
        bookmarkInput.find('input').focus();
        bookmarkWrapper.find('.search-list').addClass('show');
        var arrList = $('ul.nav.navbar-nav.bookmark-icons li'),
            $arrList = '',
            $activeItemClass = '';
        $('ul.search-list li').remove();
        for (var i = 0; i < arrList.length; i++) {
            if (i === 0) {
                $activeItemClass = 'current_item';
            } else {
                $activeItemClass = '';
            }
            var iconName = '',
                className = '';
            if ($(arrList[i].firstChild.firstChild).hasClass('feather')) {
                var classString = arrList[i].firstChild.firstChild.getAttribute('class');
                iconName = classString.split('feather-')[1].split(' ')[0];
                className = classString.split('feather-')[1].split(' ')[1];
            }
            $arrList += '<li class="auto-suggestion ' +
                $activeItemClass +
                '">' +
                '<a class="d-flex align-items-center justify-content-between w-100" href=' +
                arrList[i].firstChild.href +
                '>' +
                '<div class="d-flex justify-content-start align-items-center">' +
                feather.icons[iconName].toSvg({
                    class: 'me-75 ' + className
                }) +
                '<span>' +
                arrList[i].firstChild.dataset.bsOriginalTitle +
                '</span>' +
                '</div>' +
                feather.icons['star'].toSvg({
                    class: 'text-warning bookmark-icon float-end'
                }) +
                '</a>' +
                '</li>';
        }
        $('ul.search-list').append($arrList);
    });
    navLinkSearch.on('click', function() {
        var $this = $(this);
        var searchInput = $(this).parent('.nav-search').find('.search-input');
        searchInput.addClass('open');
        searchInputInputfield.focus();
        searchList.find('li').remove();
        bookmarkInput.removeClass('show');
    });
    $('.search-input-close').on('click', function() {
        var $this = $(this),
            searchInput = $(this).closest('.search-input');
        if (searchInput.hasClass('open')) {
            searchInput.removeClass('open');
            searchInputInputfield.val('');
            searchInputInputfield.blur();
            searchList.removeClass('show');
            appContent.removeClass('show-overlay');
        }
    });
    if ($('.search-list-main').length) {
        var searchListMain = new PerfectScrollbar('.search-list-main', {
            wheelPropagation: false
        });
    }
    if ($('.search-list-bookmark').length) {
        var searchListBookmark = new PerfectScrollbar('.search-list-bookmark', {
            wheelPropagation: false
        });
    }
    $('.search-list-main').mouseenter(function() {
        searchListMain.update();
    });
    searchInputInputfield.on('keyup', function(e) {
        $(this).closest('.search-list').addClass('show');
        if (e.keyCode !== 38 && e.keyCode !== 40 && e.keyCode !== 13) {
            if (e.keyCode == 27) {
                appContent.removeClass('show-overlay');
                bookmarkInput.find('input').val('');
                bookmarkInput.find('input').blur();
                searchInputInputfield.val('');
                searchInputInputfield.blur();
                searchInput.removeClass('open');
                if (searchInput.hasClass('show')) {
                    $(this).removeClass('show');
                    searchInput.removeClass('show');
                }
            }
            var value = $(this).val().toLowerCase(),
                activeClass = '',
                bookmark = false,
                liList = $('ul.search-list li');
            liList.remove();
            if ($(this).parent().hasClass('bookmark-input')) {
                bookmark = true;
            }
            if (value != '') {
                appContent.addClass('show-overlay');
                if (bookmarkInput.focus()) {
                    bookmarkSearchList.addClass('show');
                } else {
                    searchList.addClass('show');
                    bookmarkSearchList.removeClass('show');
                }
                if (bookmark === false) {
                    searchList.addClass('show');
                    bookmarkSearchList.removeClass('show');
                }
                var $startList = '',
                    $otherList = '',
                    $htmlList = '',
                    $bookmarkhtmlList = '',
                    $pageList = '<li class="d-flex align-items-center">' +
                    '<a href="#">' +
                    '<h6 class="section-label mt-75 mb-0">Pages</h6>' +
                    '</a>' +
                    '</li>',
                    $activeItemClass = '',
                    $bookmarkIcon = '',
                    $defaultList = '',
                    a = 0;
                $.getJSON(assetPath + 'data/' + $filename + '.json', function(data) {
                    for (var i = 0; i < data.listItems.length; i++) {
                        if ($('body').attr('data-framework') === 'laravel') {
                            data.listItems[i].url = assetPath + data.listItems[i].url;
                        }
                        if (bookmark === true) {
                            activeClass = '';
                            var arrList = $('ul.nav.navbar-nav.bookmark-icons li'),
                                $arrList = '';
                            for (var j = 0; j < arrList.length; j++) {
                                if (data.listItems[i].name === arrList[j].firstChild.dataset.bsOriginalTitle) {
                                    activeClass = ' text-warning';
                                    break;
                                } else {
                                    activeClass = '';
                                }
                            }
                            $bookmarkIcon = feather.icons['star'].toSvg({
                                class: 'bookmark-icon float-end' + activeClass
                            });
                        }
                        if (data.listItems[i].name.toLowerCase().indexOf(value) == 0 && a < 5) {
                            if (a === 0) {
                                $activeItemClass = 'current_item';
                            } else {
                                $activeItemClass = '';
                            }
                            $startList += '<li class="auto-suggestion ' +
                                $activeItemClass +
                                '">' +
                                '<a class="d-flex align-items-center justify-content-between w-100" href=' +
                                data.listItems[i].url +
                                '>' +
                                '<div class="d-flex justify-content-start align-items-center">' +
                                feather.icons[data.listItems[i].icon].toSvg({
                                    class: 'me-75 '
                                }) +
                                '<span>' +
                                data.listItems[i].name +
                                '</span>' +
                                '</div>' +
                                $bookmarkIcon +
                                '</a>' +
                                '</li>';
                            a++;
                        }
                    }
                    for (var i = 0; i < data.listItems.length; i++) {
                        if (bookmark === true) {
                            activeClass = '';
                            var arrList = $('ul.nav.navbar-nav.bookmark-icons li'),
                                $arrList = '';
                            for (var j = 0; j < arrList.length; j++) {
                                if (data.listItems[i].name === arrList[j].firstChild.dataset.bsOriginalTitle) {
                                    activeClass = ' text-warning';
                                } else {
                                    activeClass = '';
                                }
                            }
                            $bookmarkIcon = feather.icons['star'].toSvg({
                                class: 'bookmark-icon float-end' + activeClass
                            });
                        }
                        if (!(data.listItems[i].name.toLowerCase().indexOf(value) == 0) && data.listItems[i].name.toLowerCase().indexOf(value) > -1 && a < 5) {
                            if (a === 0) {
                                $activeItemClass = 'current_item';
                            } else {
                                $activeItemClass = '';
                            }
                            $otherList += '<li class="auto-suggestion ' +
                                $activeItemClass +
                                '">' +
                                '<a class="d-flex align-items-center justify-content-between w-100" href=' +
                                data.listItems[i].url +
                                '>' +
                                '<div class="d-flex justify-content-start align-items-center">' +
                                feather.icons[data.listItems[i].icon].toSvg({
                                    class: 'me-75 '
                                }) +
                                '<span>' +
                                data.listItems[i].name +
                                '</span>' +
                                '</div>' +
                                $bookmarkIcon +
                                '</a>' +
                                '</li>';
                            a++;
                        }
                    }
                    $defaultList = $('.main-search-list-defaultlist').html();
                    if ($startList == '' && $otherList == '') {
                        $otherList = $('.main-search-list-defaultlist-other-list').html();
                    }
                    $htmlList = $pageList.concat($startList, $otherList, $defaultList);
                    $('ul.search-list').html($htmlList);
                    $bookmarkhtmlList = $startList.concat($otherList);
                    $('ul.search-list-bookmark').html($bookmarkhtmlList);
                });
            } else {
                if (bookmark === true) {
                    var arrList = $('ul.nav.navbar-nav.bookmark-icons li'),
                        $arrList = '';
                    for (var i = 0; i < arrList.length; i++) {
                        if (i === 0) {
                            $activeItemClass = 'current_item';
                        } else {
                            $activeItemClass = '';
                        }
                        var iconName = '',
                            className = '';
                        if ($(arrList[i].firstChild.firstChild).hasClass('feather')) {
                            var classString = arrList[i].firstChild.firstChild.getAttribute('class');
                            iconName = classString.split('feather-')[1].split(' ')[0];
                            className = classString.split('feather-')[1].split(' ')[1];
                        }
                        $arrList += '<li class="auto-suggestion">' +
                            '<a class="d-flex align-items-center justify-content-between w-100" href=' +
                            arrList[i].firstChild.href +
                            '>' +
                            '<div class="d-flex justify-content-start align-items-center">' +
                            feather.icons[iconName].toSvg({
                                class: 'me-75 '
                            }) +
                            '<span>' +
                            arrList[i].firstChild.dataset.bsOriginalTitle +
                            '</span>' +
                            '</div>' +
                            feather.icons['star'].toSvg({
                                class: 'text-warning bookmark-icon float-end'
                            }) +
                            '</a>' +
                            '</li>';
                    }
                    $('ul.search-list').append($arrList);
                } else {
                    if (appContent.hasClass('show-overlay')) {
                        appContent.removeClass('show-overlay');
                    }
                    if (searchList.hasClass('show')) {
                        searchList.removeClass('show');
                    }
                }
            }
        }
    });
    $(document).on('mouseenter', '.search-list li', function(e) {
        $(this).siblings().removeClass('current_item');
        $(this).addClass('current_item');
    });
    $(document).on('click', '.search-list li', function(e) {
        e.stopPropagation();
    });
    $('html').on('click', function($this) {
        if (!$($this.target).hasClass('bookmark-icon')) {
            if (bookmarkSearchList.hasClass('show')) {
                bookmarkSearchList.removeClass('show');
            }
            if (bookmarkInput.hasClass('show')) {
                bookmarkInput.removeClass('show');
                appContent.removeClass('show-overlay');
            }
        }
    });
    $(document).on('click', '.bookmark-input input', function(e) {
        bookmarkInput.addClass('show');
        bookmarkSearchList.addClass('show');
    });
    $(document).on('click', '.bookmark-input .search-list .bookmark-icon', function(e) {
        e.stopPropagation();
        if ($(this).hasClass('text-warning')) {
            $(this).removeClass('text-warning');
            var arrList = $('ul.nav.navbar-nav.bookmark-icons li');
            for (var i = 0; i < arrList.length; i++) {
                if (arrList[i].firstChild.dataset.bsOriginalTitle == $(this).parent()[0].innerText) {
                    arrList[i].remove();
                }
            }
            e.preventDefault();
        } else {
            var arrList = $('ul.nav.navbar-nav.bookmark-icons li');
            $(this).addClass('text-warning');
            e.preventDefault();
            var $url = $(this).parent()[0].href,
                $name = $(this).parent()[0].innerText,
                $listItem = '',
                $listItemDropdown = '',
                iconName = $(this).parent()[0].firstChild.firstChild.dataset.icon;
            if ($($(this).parent()[0].firstChild.firstChild).hasClass('feather')) {
                var classString = $(this).parent()[0].firstChild.firstChild.getAttribute('class');
                iconName = classString.split('feather-')[1].split(' ')[0];
            }
            $listItem = '<li class="nav-item d-none d-lg-block">' +
                '<a class="nav-link" href="' +
                $url +
                '" data-bs-toggle="tooltip" data-bs-placement="bottom" title="' +
                $name +
                '">' +
                feather.icons[iconName].toSvg({
                    class: 'ficon'
                }) +
                '</a>' +
                '</li>';
            $('ul.nav.bookmark-icons').append($listItem);
            $('[data-bs-toggle="tooltip"]').tooltip();
        }
    });
    $(window).on('keydown', function(e) {
        var $current = $('.search-list li.current_item'),
            $next, $prev;
        if (e.keyCode === 40) {
            $next = $current.next();
            $current.removeClass('current_item');
            $current = $next.addClass('current_item');
        } else if (e.keyCode === 38) {
            $prev = $current.prev();
            $current.removeClass('current_item');
            $current = $prev.addClass('current_item');
        }
        if (e.keyCode === 13 && $('.search-list li.current_item').length > 0) {
            var selected_item = $('.search-list li.current_item a');
            window.location = selected_item.attr('href');
            $(selected_item).trigger('click');
        }
    });
    Waves.init();
    Waves.attach(".btn:not([class*='btn-relief-']):not([class*='btn-gradient-']):not([class*='btn-outline-']):not([class*='btn-flat-'])", ['waves-float', 'waves-light']);
    Waves.attach("[class*='btn-outline-']");
    Waves.attach("[class*='btn-flat-']");
    $('.form-password-toggle .input-group-text').on('click', function(e) {
        e.preventDefault();
        var $this = $(this),
            inputGroupText = $this.closest('.form-password-toggle'),
            formPasswordToggleIcon = $this,
            formPasswordToggleInput = inputGroupText.find('input');
        if (formPasswordToggleInput.attr('type') === 'text') {
            formPasswordToggleInput.attr('type', 'password');
            if (feather) {
                formPasswordToggleIcon.find('svg').replaceWith(feather.icons['eye-off'].toSvg({
                    class: 'font-small-4'
                }));
            }
        } else if (formPasswordToggleInput.attr('type') === 'password') {
            formPasswordToggleInput.attr('type', 'text');
            if (feather) {
                formPasswordToggleIcon.find('svg').replaceWith(feather.icons['eye'].toSvg({
                    class: 'font-small-4'
                }));
            }
        }
    });
    $(window).on('scroll', function() {
        if ($(this).scrollTop() > 400) {
            $('.scroll-top').fadeIn();
        } else {
            $('.scroll-top').fadeOut();
        }
        if ($body.hasClass('navbar-static')) {
            var scroll = $(window).scrollTop();
            if (scroll > 65) {
                $('html:not(.dark-layout) .horizontal-menu .header-navbar.navbar-fixed').css({
                    background: '#fff',
                    'box-shadow': '0 4px 20px 0 rgba(0,0,0,.05)'
                });
                $('.horizontal-menu.dark-layout .header-navbar.navbar-fixed').css({
                    background: '#161d31',
                    'box-shadow': '0 4px 20px 0 rgba(0,0,0,.05)'
                });
                $('html:not(.dark-layout) .horizontal-menu .horizontal-menu-wrapper.header-navbar').css('background', '#fff');
                $('.dark-layout .horizontal-menu .horizontal-menu-wrapper.header-navbar').css('background', '#161d31');
            } else {
                $('html:not(.dark-layout) .horizontal-menu .header-navbar.navbar-fixed').css({
                    background: '#f8f8f8',
                    'box-shadow': 'none'
                });
                $('.dark-layout .horizontal-menu .header-navbar.navbar-fixed').css({
                    background: '#161d31',
                    'box-shadow': 'none'
                });
                $('html:not(.dark-layout) .horizontal-menu .horizontal-menu-wrapper.header-navbar').css('background', '#fff');
                $('.dark-layout .horizontal-menu .horizontal-menu-wrapper.header-navbar').css('background', '#161d31');
            }
        }
    });
    $('.scroll-top').on('click', function() {
        $('html, body').animate({
            scrollTop: 0
        }, 75);
    });

    function getCurrentLayout() {
        var currentLayout = '';
        if ($html.hasClass('dark-layout')) {
            currentLayout = 'dark-layout';
        } else if ($html.hasClass('bordered-layout')) {
            currentLayout = 'bordered-layout';
        } else if ($html.hasClass('semi-dark-layout')) {
            currentLayout = 'semi-dark-layout';
        } else {
            currentLayout = 'light-layout';
        }
        return currentLayout;
    }
    var dataLayout = $html.attr('data-layout') ? $html.attr('data-layout') : 'light-layout';
    $('.nav-link-style').on('click', function() {
        var currentLayout = getCurrentLayout(),
            switchToLayout = '',
            prevLayout = localStorage.getItem(dataLayout + '-prev-skin', currentLayout);
        if (currentLayout !== 'dark-layout') {
            switchToLayout = 'dark-layout';
        } else {
            if (currentLayout === prevLayout) {
                switchToLayout = 'light-layout';
            } else {
                switchToLayout = prevLayout ? prevLayout : 'light-layout';
            }
        }
        localStorage.setItem(dataLayout + '-prev-skin', currentLayout);
        localStorage.setItem(dataLayout + '-current-skin', switchToLayout);
        setLayout(switchToLayout);
        $('.horizontal-menu .header-navbar.navbar-fixed').css({
            background: 'inherit',
            'box-shadow': 'inherit'
        });
        $('.horizontal-menu .horizontal-menu-wrapper.header-navbar').css('background', 'inherit');
    });
    var currentLocalStorageLayout = localStorage.getItem(dataLayout + '-current-skin');

    function setLayout(currentLocalStorageLayout) {
        var navLinkStyle = $('.nav-link-style'),
            currentLayout = getCurrentLayout(),
            mainMenu = $('.main-menu'),
            navbar = $('.header-navbar'),
            switchToLayout = currentLocalStorageLayout ? currentLocalStorageLayout : currentLayout;
        $html.removeClass('semi-dark-layout dark-layout bordered-layout');
        if (switchToLayout === 'dark-layout') {
            $html.addClass('dark-layout');
            mainMenu.removeClass('menu-light').addClass('menu-dark');
            navbar.removeClass('navbar-light').addClass('navbar-dark');
            navLinkStyle.find('.ficon').replaceWith(feather.icons['sun'].toSvg({
                class: 'ficon'
            }));
        } else if (switchToLayout === 'bordered-layout') {
            $html.addClass('bordered-layout');
            mainMenu.removeClass('menu-dark').addClass('menu-light');
            navbar.removeClass('navbar-dark').addClass('navbar-light');
            navLinkStyle.find('.ficon').replaceWith(feather.icons['moon'].toSvg({
                class: 'ficon'
            }));
        } else if (switchToLayout === 'semi-dark-layout') {
            $html.addClass('semi-dark-layout');
            mainMenu.removeClass('menu-dark').addClass('menu-light');
            navbar.removeClass('navbar-dark').addClass('navbar-light');
            navLinkStyle.find('.ficon').replaceWith(feather.icons['moon'].toSvg({
                class: 'ficon'
            }));
        } else {
            $html.addClass('light-layout');
            mainMenu.removeClass('menu-dark').addClass('menu-light');
            navbar.removeClass('navbar-dark').addClass('navbar-light');
            navLinkStyle.find('.ficon').replaceWith(feather.icons['moon'].toSvg({
                class: 'ficon'
            }));
        }
        if ($('input:radio[data-layout=' + switchToLayout + ']').length > 0) {
            setTimeout(function() {
                $('input:radio[data-layout=' + switchToLayout + ']').prop('checked', true);
            });
        }
    }
})(window, document, jQuery);

function featherSVG(iconSize) {
    if (iconSize == undefined) {
        iconSize = '14';
    }
    return feather.replace({
        width: iconSize,
        height: iconSize
    });
}
if (typeof jQuery.validator === 'function') {
    jQuery.validator.setDefaults({
        errorElement: 'span',
        errorPlacement: function(error, element) {
            if (element.parent().hasClass('input-group') || element.hasClass('select2') || element.attr('type') === 'checkbox') {
                error.insertAfter(element.parent());
            } else if (element.hasClass('form-check-input')) {
                error.insertAfter(element.parent().siblings(':last'));
            } else {
                error.insertAfter(element);
            }
            if (element.parent().hasClass('input-group')) {
                element.parent().addClass('is-invalid');
            }
        },
        highlight: function(element, errorClass, validClass) {
            $(element).addClass('error');
            if ($(element).parent().hasClass('input-group')) {
                $(element).parent().addClass('is-invalid');
            }
        },
        unhighlight: function(element, errorClass, validClass) {
            $(element).removeClass('error');
            if ($(element).parent().hasClass('input-group')) {
                $(element).parent().removeClass('is-invalid');
            }
        }
    });
}