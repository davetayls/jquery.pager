//-------------------------------------------------
//		Pager jquery plugin
//      Changed and Modified by Dave Taylor http://the-taylors.org
//		Created by dan and emanuel @geckonm.com as jquery.pager
//		www.geckonewmedia.com
// 
//		v1
//-------------------------------------------------
/*global jQuery */
/*jslint onevar:false */
(function ($) {

    var CSS_PREFIX      = 'pager-';

    var addPageNumberClasses = function (container$, pageSize) {
            var pageCounter = 1;
            container$.children().each(function (i) {
                if (i >= pageCounter * pageSize) {
                    pageCounter += 1;
                }
                $(this).addClass(CSS_PREFIX + "page-" + pageCounter);
            });
            return pageCounter;
        },

        showPage = function (container$, pageNumber) {
            container$.children().hide();
            container$.children('.' + CSS_PREFIX + "page-" + pageNumber).show();
            return pageNumber;
        },
        getFirstPageToShow = function (navItemIndex, numberAdjacentItems, totalItems) {
            var firstPageIndex;
            if (navItemIndex === 0) {
                return 0;
            }
            if (navItemIndex > (totalItems - (numberAdjacentItems * 2))) {
                firstPageIndex = (totalItems - 1) - (numberAdjacentItems * 2);
            } else {
                firstPageIndex = navItemIndex - numberAdjacentItems;
            }
            if (firstPageIndex < 0) {
                return 0;
            } else {
                return firstPageIndex;
            }
        },
        getLastPageToShow = function (navItemIndex, numberAdjacentItems, totalItems) {
            var lastPageIndex;
            if (navItemIndex === totalItems - 1) {
                return totalItems;
            }
            if (navItemIndex < numberAdjacentItems) {
                lastPageIndex = 1 + (numberAdjacentItems * 2);
            } else {
                lastPageIndex = (navItemIndex + 1) + numberAdjacentItems;
            }
            if (lastPageIndex > totalItems) {
                return totalItems;
            } else {
                return lastPageIndex;
            }
        },
        selectNavPage = function (nav$, pageNumber, maxPageNavItems) {
            var allNavItems$ = nav$.children('li'),
                totalItems = allNavItems$.length,
                navItemIndex = pageNumber - 1,
                firstPageToShow,
                lastPageToShow;

            var numberAdjacentItems = Math.floor((maxPageNavItems - 1) / 2);

            if (totalItems < maxPageNavItems) {
                firstPageToShow = 0;
                lastPageToShow = totalItems;
            } else {
                firstPageToShow = getFirstPageToShow(navItemIndex, numberAdjacentItems, totalItems);
                lastPageToShow = getLastPageToShow(navItemIndex, numberAdjacentItems, totalItems);
            }

            allNavItems$.hide()
                        .removeClass(CSS_PREFIX + 'firstPage')
                        .removeClass(CSS_PREFIX + 'lastPage')
                        .slice(firstPageToShow, lastPageToShow)
                        .show();

            allNavItems$.first().addClass(CSS_PREFIX + 'firstPage').show();
            allNavItems$.last().addClass(CSS_PREFIX + 'lastPage').show();

            nav$.find('li.' + CSS_PREFIX + 'currentPage').removeClass(CSS_PREFIX + 'currentPage');
            allNavItems$.eq(navItemIndex).addClass(CSS_PREFIX + "currentPage");

            return pageNumber;
        }
        ;


    $.fn.pager = function (options) {

        var defaults = {
            pageSize: 10,
            maxPageNavItems: 9,
            currentPage: 1,
            holder: null,
            pagerLocation: "after",
            pageNavCss: "",
            pageTemplate: '<li class="' + CSS_PREFIX + 'nav-${PageNumber}"><a rel="${PageNumber}" href="#">${PageNumber}</a></li>'
        };

        options = $.extend(defaults, options);

        return this.each(function () {

            var selector = $(this);
            var i,
				pageCounter = 1,
                pageSize = selector.data('pagesize') || options.pageSize;

            if (!selector.parent().hasClass(CSS_PREFIX + 'container')) {
                selector.wrap('<div class="' + CSS_PREFIX + 'container ' + CSS_PREFIX + 'active"></div>');

                pageCounter = addPageNumberClasses(selector, pageSize);
                showPage(selector, options.currentPage);
                if (pageCounter <= 1) {
                    return;
                }

                //Build pager navigation
                var pageNav$ = $('<ul class="' + CSS_PREFIX + 'nav ' + options.pageNavCss + '"></ul>');
                for (i = 1; i <= pageCounter; i += 1) {
                    pageNav$.append(options.pageTemplate.replace(/\$\{PageNumber\}/g, i));
                }

                // add nav to page
                if (!options.holder) {
                    switch (options.pagerLocation) {
                    case "before":
                        selector.before(pageNav$);
                        break;
                    default:
                        selector.after(pageNav$);
                    }
                } else {
                    $(options.holder).append(pageNav$);
                }

                //pager navigation behaviour
                selector.parent().delegate('.' + CSS_PREFIX + 'nav a', 'click', function () {
                    var clickedPageNumber = $(this).attr('rel');
                    options.currentPage = selectNavPage(pageNav$, clickedPageNumber, options.maxPageNavItems);
                    showPage(selector, clickedPageNumber);
                    return false;
                });

                selectNavPage(pageNav$, options.currentPage, options.maxPageNavItems);
            }
        });
    };


}(jQuery));

