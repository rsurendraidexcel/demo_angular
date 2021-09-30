import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, AfterContentChecked, AfterContentInit } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { AppConfig } from '../../app/app.config';
import { URLSearchParams } from '@angular/http';
import { CustomHttpService } from '../../app-common/services/http.service';
import { CookieService } from 'ngx-cookie-service';
import { Router, ActivatedRoute } from "@angular/router";
import { SelectItem } from 'primeng/primeng';
import { ClientDetailsModel, ManagerDetailsModel } from './navbar.model';
import { Observable } from 'rxjs/Rx';
import { RolesAndPermissionService } from '@cyncCommon/component/roles-and-permissions/roles-and-permissions.service';
import { Helper } from '@cyncCommon/utils/helper'
import { CyncConstants } from '@cyncCommon/utils/constants';
import { NavbarService } from '@app/navbar/service/navbar.service';
import { APIMapper } from '@cyncCommon/utils/apimapper';
import { MenuBreadCrumbModel, SelectedMenuModel } from '@app/navbar/model/menu.model';
import { MenuPaths } from '@cyncCommon/utils/menu-path';
import { ClientSelectionService } from '@cyncCommon/services/client-selection.service';
import * as moment from 'moment-timezone';
import { CyncIndexdbService } from '@cyncCommon/services/cync-indexdb.service';
import * as $ from 'jquery';
import { MatomoInjectorService } from '@cyncCommon/services/matomo/matomo-injector-service';
import { UserTourService } from '@app/modules/user-tour/user-tour.service';
declare var introJs: any;
const MINUTES_UNITL_AUTO_LOGOUT = 30; // in mins
const CHECK_INTERVAL = 15000; // in ms
const STORE_KEY = 'lastAction';
const MENU_PATH_SEPARATOR = '/';

@Component({
    selector: 'navbar-comp',
    styleUrls: ['./navbar.css'],
    templateUrl: './navbar.html'
})

export class navbarComponent implements OnInit, AfterViewInit, AfterContentChecked, AfterContentInit {
    apiURL: any;
    mainMenuList: any;
    backMenuList: any;
    serviceUrl: string;
    notificationUrl: string;
    authToken: any;
    disableBack: boolean = false;
    cyncMenuList: any;
    cyncMenuListTemp: any;
    enableBack: boolean = true;
    backButtonId: Array<any> = [];
    pathArray: Array<any> = [];
    routerPath: string;
    notifications: any;
    userInfo: any;
    buildInformation: any;
    cyncCookie: any;
    notifictionCount = 0;
    notificationItems: any;
    lenderId: any;
    viewAllNotifications: boolean = false;
    expandAllNotifications: boolean = true;
    lenderInfo: string;
    footerInfo: any;
    showLoading: boolean = true;
    selectedTheme_0: boolean = true;
    selectedTheme_1: boolean = false;
    selectedTheme_2: boolean = false;
    selectedTheme_3: boolean = false;
    selectedTheme: string;
    selectedUserTheme: string;
    isRorLink = true;
    clients: any;
    showClientStatus: boolean = false;
    /*clientLists: any;
    selectedClient: string = null;*/
    clientLists: ClientDetailsModel[];
    clientListArray: SelectItem[] = [];
    clientStatusArray: SelectItem[];
    selectedClientStatus: number = 1;
    selectedClient: string;
    managers: any;
    /*managerLists: any;*/
    managerLists: ManagerDetailsModel[];
    managerListArray: SelectItem[] = [];
    selectedManager: string;
    /*selectedManager: string = null;*/
    cync_MenuSearch: string;
    headerLogo: string;
    hideMoreIcon = false;
    angularMenu: any;
    //cyncBreadcrumb: string;
    urlPath: string;
    cyncBreadCrumb: any[] = [];
    // selectedMenu: any;
    notificationApiKey: any;
    urlModule: any;
    urlPathOne: any;
    urlPathTwo: any;
    cyncUserId: string;
    notifictionCountAll = 0;
    notificationItemsAll: any;
    supportPortalPermission: any;
    hideIcon: boolean = false;
    cyncMenus: any;
    showSubMenus: boolean = true;
    recentlyVisited: any[] = [];
    showTimeoutPopup: boolean = false;
    Username: string;
    Password: string;
    requestModel: any;
    modal_height: any;
    isPermissionLoaded: boolean = false;
    isErrorMessage: boolean = false;
    borrowerId: any;
    /*Code Changes for Dynamic Menu CYNCUXT-3269 begin*/
    showPrimaryMenu: boolean = false;
    showSubMenu: boolean = false;
    isExpandStyleVisible: boolean = false;
    isdisableToggle: boolean = false;
    subMenuList: any;
    currentMenuSelected: string;
    /*Code Changes for Dynamic Menu CYNCUXT-3269 ends*/
    subMenusArr: any[] = [];
    /*code changes for notification CYNCUXT-3468 begin*/
    notificationSuccessCount: number = 0;
    notificationAlertCount: number = 0;
    notificationErrorCount: number = 0;
    showTwoColNotification: boolean = false;
    isNotificationLoaded: boolean = false;
    /*code changes for notification CYNCUXT-3468 begin*/
    assetsPath = CyncConstants.getAssetsPath();
    isMenuLoaded = false;
    isNavActive: boolean = false;
    supportlinkViewPermission: boolean = false;
    selectClientPlaceHolder = CyncConstants.SELECT_CLIENT_PLACEHOLDER;
    selectClientStatusPlaceholder = "Select Client Status";
    currentYear = (new Date()).getFullYear();
    currentClient = null;
    editForm: boolean;
    routePath: string;
    currentApp = 'angular';
    bookMarkedList: any;
    recentVisitedList: any;
    bookMarkIconToggle: boolean = true;
    walkThroughTitle: any[] = [];
    screen_id:string = null;
    newTag: boolean = false;
    guideFeature: boolean= false;

    @ViewChild('widgetsContent', { read: ElementRef }) public widgetsContent: ElementRef<any>;

    public scrollRight(): void {
        this.widgetsContent.nativeElement.scrollTo({ left: (this.widgetsContent.nativeElement.scrollLeft + 150), behavior: 'smooth' });
    }

    public scrollLeft(): void {
        this.widgetsContent.nativeElement.scrollTo({ left: (this.widgetsContent.nativeElement.scrollLeft - 150), behavior: 'smooth' });
    }

    constructor(
        private _helper: Helper,
        private rolesPermComp: RolesAndPermissionService,
        private config: AppConfig,
        private http: Http,
        private httpClient: HttpClient,
        private _service: CustomHttpService,
        public _router: Router,
        private cookieService: CookieService,
        private _navbarService: NavbarService,
        private _apiMapper: APIMapper,
        private _clientSelectionService: ClientSelectionService,
        private idbService: CyncIndexdbService,
        private userTourService: UserTourService,
        public mtInjectorService: MatomoInjectorService,
        private route: ActivatedRoute) {

        this.lenderId = this.config.getConfig('lenderId');
        this.serviceUrl = this.config.getConfig('host_ror');
        this.notificationUrl = this.config.getConfig('host_ror');
        this.notificationApiKey = this.config.getConfig('notificationAPIKey');
        this.apiURL = 'menus';
        this.cyncCookie = this.cookieService.get('cync_authorization');
        sessionStorage.removeItem('lastAction');
        this.check();
        this.initListener();
        this.initInterval();

        if (this.cyncCookie) {
            this.authToken = 'Bearer ' + this.cyncCookie;
        } else {
            if (this.config.MI_ON_LOCAL_SERVER()) {
                this.authToken = 'Bearer ' + this._helper.getMyLocalToken();
            } else {
                window.location.href = '../../';
            }
        }
        this._helper.getEditForm().subscribe((d) => this.editForm = d);
        this.clientStatusOptions();
    }
    ngOnInit() {
       // this.loadScript(this.assetsPath + '/js/custom.js');
        this.cyncUserInfo();
        this.setManagerAndClient();
        this.getLenderInfo();
        this.getBuildVersion();
        this.getPageDisplayCount();
        this.routePath = window.location.pathname.replace("/index.html", "/");
        $("#cync_app_dashboard").removeClass("loading-modal-initial");
        localStorage.removeItem('SubMenuList');
        localStorage.removeItem('BackButton');
        localStorage.removeItem('BreadCrumb');
        localStorage.removeItem('selectedClient');

        Observable.interval(1000 * 60).subscribe(x => {
            this.getNotifications();
        });
    }
    ngAfterContentChecked() {
        var outerWidth = document.getElementById('subnav_navContents').scrollWidth;
        var innerWidth = document.getElementById('subnav_navContents').offsetWidth;
        if (innerWidth >= outerWidth) {
            $('.scrollArrow').hide();
        } else {
            $('.scrollArrow').show();
        }
    }

    ngAfterViewInit() {
        // document.getElementById("hamburger_icon").addEventListener('mouseover', ($event) => this.clearMenuSearch());
        this.loadBookMarkedMenu();
    }

    ngAfterContentInit() {

    }

    // Load All Bookmarked Items
    loadBookMarkedMenu() {
        this.idbService.getBookMark().subscribe(resData => {
            this.bookMarkedList = resData;
        });
        this.idbService.getRecentVisit().subscribe(resData => {
            this.recentVisitedList = resData;
        });

    }

    bookMarkedRouteLink($event: any) {
        let event1 = $event;
        let processinType = $event.target.dataset.process_type;
        $('#bookmark-box:visible').hide();
        let path = decodeURIComponent(($event.target.dataset.href));
        let selectedObj = this.clientLists.find((elm) => elm.id === Number(this.selectedClient));
        if (this.config.getEnvName() === "local") {
            // Local Angular Screen Access
            let temurl = $event.target.dataset.href.split("#");
            if (selectedObj !== undefined) {
                if (processinType === selectedObj.processng_type) {
                    this.updateBreadCrumbAndCheckClientSelection(event1, `#${temurl[1]}`);
                    this._router.navigateByUrl(temurl[1]);
                } else if (processinType === "ABL" && selectedObj.processng_type == "Factoring") {
                    let homeNavigate = window.origin + '/factoring/dashboard';
                    window.location.replace(homeNavigate);
                } else if (processinType === "Factoring" && selectedObj.processng_type == "ABL") {
                    let homeNavigate = window.origin + '/?home_source=icon';
                    window.location.replace(homeNavigate);
                } else if (processinType === "Factoring" && selectedObj.processng_type == undefined) {
                    this._helper.openAlertPoup('Information', 'Please Select Factoring Client');
                    return false;
                } else if (processinType === "ABL" && selectedObj.processng_type == undefined) {
                    this._helper.openAlertPoup('Information', 'Please Select ABL Client');
                    return false;
                } else {
                    this.updateBreadCrumbAndCheckClientSelection(event1, `#${temurl[1]}`);
                    this._router.navigateByUrl(temurl[1]);
                }

            } else {
                this.updateBreadCrumbAndCheckClientSelection(event1, `#${temurl[1]}`);
                this._router.navigateByUrl(temurl[1]);
            }

        } else {

            // Angular Page Routes
            if ($event.target.dataset.href.includes('/angular/#/')) {
                let temurl = $event.target.dataset.href.split("#");
                if (selectedObj !== undefined) {
                    if (processinType === selectedObj.processng_type) {
                        this.updateBreadCrumbAndCheckClientSelection(event1, `#${temurl[1]}`);
                        this._router.navigateByUrl(temurl[1]);
                    } else if (processinType === "ABL" && selectedObj.processng_type == "Factoring") {
                        let homeNavigate = window.origin + '/factoring/dashboard';
                        window.location.replace(homeNavigate);
                    } else if (processinType === "Factoring" && selectedObj.processng_type == "ABL") {
                        let homeNavigate = window.origin + '/?home_source=icon';
                        window.location.replace(homeNavigate);
                    } else if (processinType === "Factoring" && selectedObj.processng_type == undefined) {
                        this._helper.openAlertPoup('Information', 'Please Select Factoring Client');
                        return false;
                    } else if (processinType === "ABL" && selectedObj.processng_type == undefined) {
                        this._helper.openAlertPoup('Information', 'Please Select ABL Client');
                        return false;
                    } else {
                        this.updateBreadCrumbAndCheckClientSelection(event1, `#${temurl[1]}`);
                        this._router.navigateByUrl(temurl[1]);
                    }
                } else {
                    this.updateBreadCrumbAndCheckClientSelection(event1, `#${temurl[1]}`);
                    this._router.navigateByUrl(temurl[1]);
                }

            } else {

                // ROR Page Link Termloan Page
                if (selectedObj !== undefined) {
                    if (processinType === selectedObj.processng_type) {
                        if (path.includes('/borrowers/') === true) {
                            let status = this.getClientID_from_bookmark_url(path);
                            if (status !== false) {
                                let changeUrl = path.replace(status, this.selectedClient);
                                window.location.replace(`${changeUrl}`);
                            } else if (path.includes('/new?') === true) {
                                window.location.replace(`${path}`);
                            } else if (path.includes('/borrowers/summary/') === true) {
                                window.location.replace(`${path}`);
                            } else {
                                window.location.replace(`${path}`);
                            }
                        } else {
                            window.location.replace(`${path}`);
                        }

                    } else if (processinType === "ABL" && selectedObj.processng_type == "Factoring") {
                        let homeNavigate = window.origin + '/factoring/dashboard';
                        window.location.replace(homeNavigate);
                    } else if (processinType === "Factoring" && selectedObj.processng_type == "ABL") {
                        let homeNavigate = window.origin + '/?home_source=icon';
                        window.location.replace(homeNavigate);
                    } else if (processinType === "Factoring" && selectedObj.processng_type == undefined) {
                        this._helper.openAlertPoup('Information', 'Please Select Factoring Client');
                        return false;
                    } else if (processinType === "ABL" && selectedObj.processng_type == undefined) {
                        this._helper.openAlertPoup('Information', 'Please Select ABL Client');
                        return false;
                    } else {
                        window.location.replace(`${path}`);
                    }

                } else {
                    //if borrower not seleced but Navigation url is borrower  
                    if (path.includes('/borrowers/') === true && processinType === "ABL") {
                        if (path.includes('/new?') === true) {
                            window.location.replace(`${path}`);
                        } else if (path.includes('/borrowers/summary/') === true) {
                            window.location.replace(`${path}`);
                        } else {
                            this._helper.openAlertPoup('Information', 'Please Select ABL Client');
                            return false;
                        }
                    } else if (path.includes('borrowers') === true && processinType === "Factoring") {
                        if (path.includes('/new?') === true) {
                            window.location.replace(`${path}`);
                        } else if (path.includes('/borrowers/summary/') === true) {
                            window.location.replace(`${path}`);
                        } else {
                            this._helper.openAlertPoup('Information', 'Please Select Factoring Client');
                            return false;
                        }
                    } else {
                        window.location.replace(`${path}`);
                    }

                }

            }

        }
    }

    // check Borrower Id
    getClientID_from_bookmark_url(url: string) {
        var temp = url.split("/");
        var ch = temp.filter(el => { return el !== ""; }).filter(k => { return !isNaN(Number(k)); });
        if (ch.length === 1) {
            return ch[0];
        } else {
            return false;
        }
    }


    openAddBookMarkedBox(event: any) {
        var labelName = this.cyncBreadCrumb[this.cyncBreadCrumb.length - 1];
        $("#bookmarkedName").attr("data-value", labelName);
        $("#bookmarkedName").val(labelName);
        $("#add-bookmark-panel").show();
    }
    cancelBookMarkedBox() {
        $("#add-bookmark-panel").hide();
    }
    // Add to New BookMarked Menu
    addbookMark(event: any) {
        let currentURI = `${window.origin}/angular/#${this._router.url}`;
        let customName = $("#bookmarkedName").val();
        if (typeof customName === "string") {
            customName = customName.replace(/^\s+|\s+$/g, "");
        }
        let selectedClientObj = this.clientLists.find((elm) => elm.id === Number(this.selectedClient));
        let processingType;
        if (selectedClientObj) {
            console.log("Client selection procesing ::", selectedClientObj.processng_type);
            if (this.cyncBreadCrumb[0] == 'Administration') {
                processingType = 'both';
            } else {
                processingType = selectedClientObj.processng_type;
            }

        } else {
            processingType = "both";
        }

        // console.log("Releate Data", this.cyncBreadCrumb, currentURI , this.userInfo.user_name);
        let newItem = {
            name: this.cyncBreadCrumb[this.cyncBreadCrumb.length - 1],
            custom_name: customName,
            category: this.cyncBreadCrumb[this.cyncBreadCrumb.length - 2],
            url: currentURI,
            menu_hierarchy: this.cyncBreadCrumb.join(" > ").trim(),
            created_by_user: `${this.userInfo.user_name}`,
            processing_type: processingType,
            current_date: new Date()
        };
        console.log("newItem:", newItem);
        let exitingCustomeName = this.bookMarkedList.filter(elm => { return elm.custom_name === `${customName}`; });
        if (customName && customName != "") {
            if (exitingCustomeName.length === 1 && exitingCustomeName[0].custom_name === customName) {
                this._helper.showFlashMessage("Bookmark name already exists", "Error");
                return false;
            } else {
                this.idbService.addBookMarkItem(newItem);
                this.bookMarkIconToggle = false;
                $("#add-bookmark-panel").hide();
            }

        } else {
            $("#bookmarkedName").val('');
            $("#bookmarkedName").attr("placeholder", "Please Enter bookmark name");
        }

    }
    // Delete From BookMared Menu
    deleteBookMark(evnet: any) {
        //let sname =  this.cyncBreadCrumb[this.cyncBreadCrumb.length - 1];
        let mh = this.cyncBreadCrumb.join(" > ").trim();
        let item = this.bookMarkedList.filter(elm => { return elm.menu_hierarchy === `${mh}`; });
        if (item.length === 1) {
            this.idbService.deleteBookMarkItem(item[0].id);
            this.loadBookMarkedMenu();
            this.bookMarkIconToggle = true;
        }
    }
    // Show BookMarked list 
    viewBookMark(evt: any) {
        evt.stopPropagation();
        this.idbService.readAllStore().then(data => {
            this.bookMarkedList = data;
            if (this.bookMarkedList.length > 0 || this.recentVisitedList.length > 0) {
                $("#bookmark-box").show();
                $("#bookmark-box").bind("contextmenu", (e) => { return false; });
                $(".fused-label").css({ 'color': '#377BB4' });
                if ($("#cync-tour-panel").is(":visible")) { $("#cync-tour-panel").hide(); }
            }
        });
    }
    // BookMarked Icon Toggle Method Defined
    bookMarkedItemToggle(breadCrumbArray: any) {
        let availableItem = this.idbService.getFilterItem(breadCrumbArray);
        // console.log(this.angularMenu);
        if (availableItem.length > 0) {
            this.bookMarkIconToggle = false;
            console.log("Already addeded BookMarked Menu", this.bookMarkIconToggle);
        } else {
            this.bookMarkIconToggle = true;
            console.log("No BookMarked In Menu", this.bookMarkIconToggle);
        }
        // Recent addNavigationLinks call
        this.addRecentNavigationLinks(availableItem);
        this.getTourTitle();
    }
    // Add New addRecentNavigationLinks
    addRecentNavigationLinks(tabName: string) {
        let selectdTabName = this.cyncBreadCrumb[this.cyncBreadCrumb.length - 1];
        let selectedBredCrumObj = this.angularMenu.filter(bredCrumModel => { return bredCrumModel.menuName === selectdTabName; });
        //console.log(selectedBredCrumObj[0]);
        let selectedClientObj = this.clientLists.find((elm) => elm.id === Number(this.selectedClient));
        let processingType;
        if (selectedClientObj) {
            console.log("Client selection procesing ::", selectedClientObj.processng_type);
            if (selectedBredCrumObj[0].breadCrumb[0] === 'Administration') {
                processingType = 'both';
            } else {
                processingType = selectedClientObj.processng_type;
            }

        } else {
            processingType = "both";
        }

        let newRecentItem = {
            name: this.cyncBreadCrumb[this.cyncBreadCrumb.length - 1],
            category: this.cyncBreadCrumb[this.cyncBreadCrumb.length - 2],
            url: selectedBredCrumObj[0].path,
            menu_hierarchy: this.cyncBreadCrumb.join(" > ").trim(),
            created_by_user: `${this.userInfo.user_name}`,
            processing_type: processingType,
            current_date: new Date()
        };
        this.idbService.resentAddbookMark(newRecentItem);
        //Entry Matomo Section
        let clientInfo = {client_name: "Select Client"}; 
        if (this.selectedClient) {
            clientInfo = this.clientLists.find((elm) => elm.id === Number(this.selectedClient));
        }
        let trakerCommonContent={
            bred_crumb: this.cyncBreadCrumb.join(" 👉 ").trim(),
            user_name: `${this.userInfo.user_name}`,
            url: selectedBredCrumObj[0].path,
            screen_name: this.cyncBreadCrumb[this.cyncBreadCrumb.length - 1],
            user_id: localStorage.getItem("cyncUserId"),
            user_login: localStorage.getItem("user_login"),
            user_email: localStorage.getItem("user_email"),
            borrower_name:`${clientInfo.client_name}`
        };
        this.mtInjectorService.matomoEntry(trakerCommonContent);  
    }
    /* Tour Guiding Section*/
    getTourTitle() {
        let m = this.cyncBreadCrumb.join(" > ").trim();
        let url = "menu-hierarchy/create";
        let pb = {
            menu_hierarchy_name: `${m}`,
            user_email: `${this.userInfo.user_name}`
        };
        if (m && this.userInfo.user_name) {
            this.userTourService.postService(url, pb).subscribe((res) => {
                this.screen_id = res.screen_id;
                if (this.screen_id) {
                    let url = `active-tour-question?screen_id=${this.screen_id}&status=active`;
                    this.userTourService.getService(url).subscribe(res2 => {
                        this.walkThroughTitle = res2.data;
                        let ctag=0;
                        if(this.walkThroughTitle.length > 0){
                            this.guideFeature=true;
                            this.walkThroughTitle.forEach(elm => {
                                if(elm.tag==false){ctag++;}
                            });
                            if(ctag>0){ this.newTag=true; }else{this.newTag=false}
                        } else{
                            this.guideFeature=false;
                        }  
                    });
                }
            }, (error) => {
                console.log("Error", error);
            });
        } else {
            console.log("Menu Not found");
        }
    }

    showTourTitile() {
        let wtt = this.walkThroughTitle;
        $("#cync-tour-panel").show();
    }
    onleaveTourPannel(event: any) {
        setTimeout(() => {
          $("#cync-tour-panel").hide();
        }, 400);
    }

    showStep(tourId: string, tag: boolean) {
        console.log(tourId, tag);
        const intro = introJs();
        let url = `tour-step?tour_id=${tourId}`;
        if(tag===false){
            let tagurl='tag-view';
            let playload = {
                screen_id: `${this.screen_id}`,
                tour_id: `${tourId}`
            };
            this.userTourService.postService(tagurl, playload).subscribe((res) => {
                let tagdata=res.data;
                this.getTourTitle();
                return tagdata;
            });
        }
        this.userTourService.getService(url).subscribe(res => {
            let data = res.data;
            if (data.length > 0) {
                let result = data.map(el => {
                    return {
                        "title": el.step_title,
                        "intro": el.step_intro,
                        "element": $(el.step_element)[0],
                        "position": el.element_position
                    }
                });

                console.log("==all Step==::", result);
                intro.setOptions({
                    steps: result
                }).start();

                intro.refresh();
            }

        });
    }
    
    tourSetup(){
        window.location.replace(`${window.origin}/angular/#/user-tour`);
        document.location.reload();
    }
    /* End Tou Guiding Section*/

    public loadScript(url: string) {
        let node = document.createElement('script');
        node.src = url;
        node.type = 'text/javascript';
        document.getElementsByTagName('head')[0].appendChild(node);
    }

    cyncUserInfo() {
        const httpHeader: HttpHeaders = new HttpHeaders({
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': this.authToken,
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'access-control-allow-headers,access-control-allow-origin',
            'lenderId': this.config.getConfig('lenderId')
        });

        this.httpClient.get(this.serviceUrl + 'users/get_user_info', { headers: httpHeader }).
            subscribe((res) => {
                this.userInfo = res;
                this.cyncUserId = this.userInfo.id;
                //console.log(this.userInfo.login);
                this.Username = this.userInfo.login;
                localStorage.setItem('cyncUserRole', this.userInfo.role_type);
                localStorage.setItem('cyncUserRoleId', this.userInfo.role_id);
                localStorage.setItem('cyncUserId', this.cyncUserId);
                localStorage.setItem('user_login', this.userInfo.login);
                localStorage.setItem('user_email', this.userInfo.email);
                // console.log('this.cyncUserId---'+this.cyncUserId)
                $("#cync_app_dashboard").removeClass();
                if (this.userInfo.theme == "officeblue_layout") {
                    this.selectedUserTheme = "theme_1";
                } else if (this.userInfo.theme == "green_layout") {
                    this.selectedUserTheme = "theme_2";
                } else if (this.userInfo.theme == "pearl_layout") {
                    this.selectedUserTheme = "theme_0";
                } else {
                    this.selectedUserTheme = "theme_3";
                }

                /*Code cahnges for correct order for roles and permission begin*/
                this._service.getCall('roles/' + this.userInfo.role_id + '/role_permissions/all_menu_permissions').then(res => {
                    let responseData: any[] = this._service.bindData(res);


                    // show and hide client status
                    if (this.userInfo.role_type != 'Borrower') {
                        let inactiveClientsArray = responseData[0][1].submenu_list.find(elm => {
                            return elm.menu_identifier == "inactive_clients";
                        });
                        let inActiveClientSummaryPermission;
                        inactiveClientsArray.permissions.find(elm => {
                            if (elm.action_label === "Summary") {
                                inActiveClientSummaryPermission = elm.enabled;
                                return elm;
                            }
                        });
                        if (inActiveClientSummaryPermission) {
                            this.showClientStatus = true;
                        } else {
                            this.showClientStatus = false;
                        }
                    }


                    let suppoLinkArray = responseData[0].find(elm => {
                        return elm.menu_identifier == "support_portal";
                    });

                    if (suppoLinkArray) {

                        localStorage.setItem("supportPortalPermissionsArray", JSON.stringify(suppoLinkArray.submenu_list));

                        //    permission check for support link
                        let viewsupportlinkPermissionArray;
                        this.supportPortalPermission = suppoLinkArray.submenu_list;
                        let supportLinkArray = this.supportPortalPermission.find(elm => {
                            return elm.menu_identifier == "support_link";
                        })

                        if (supportLinkArray) {

                            viewsupportlinkPermissionArray = supportLinkArray.permissions.find(elm => {
                                return elm.action_label === "Enable";
                            })
                        }
                        if (viewsupportlinkPermissionArray) {
                            this.supportlinkViewPermission = viewsupportlinkPermissionArray.enabled
                        }
                    }

                    this.rolesPermComp.savePermissionsInLocalStorage(responseData);

                    this.isPermissionLoaded = true;
                });
                /*Code cahnges for correct order for roles and permission ends*/
                //this.selectedUserTheme = this.userInfo.theme;
                this.getNotifications();
                $("#cync_app_dashboard").addClass(this.selectedUserTheme);

                // BookMarked Initialize Aftere User Information get
                this.idbService.cyncdbInitialize(this.userInfo.email);
            }, error => {
                this.showLoading = false;
                if (error.status === 401 || error.status === 409) {
                    this._service.setSessinTimeout(true);
                }
                this._service.handleError(error);
            })
    }

    /**
    * Method load the menuMap having breadcrumb and path data for each menu
    */
    loadMenuMap() {
        this._navbarService.getCurrentState(this._apiMapper.endpoints[CyncConstants.CURRENT_STATE]).subscribe(current_state => {
            if (current_state.borrower_id != null) {
                this.selectedClient = current_state.borrower_id;
                CyncConstants.setSelectedClient(this.selectedClient);
            }

            if (current_state.manager_id != null) {
                this.selectedManager = current_state.manager_id;
            }

            if (this.selectedClient === undefined) {
                this.selectedClient = null;
            }

            this._navbarService.getMenus(this._apiMapper.endpoints[CyncConstants.MENUS].replace("{borrower_id}", this.selectedClient)).subscribe(menus => {
                this.cyncMenus = menus;
                let arrMenus = this.populateMenuMap(menus, new Map<string, MenuBreadCrumbModel>(), []);
                this.userAndClientInfo();
                //This needs to be removed Response from api is ready for phase 2 menus
                //arrMenus = this.addMissingMenus(arrMenus);

                this.subMenusArr = arrMenus;
                this.getUpdatedAngularMenuAndBreadCrumb();
                this.isMenuLoaded = true
                this.showLoading = false;
            });
        });
    }

    userAndClientInfo() {
        if (this.selectedClient) {
            let clientInfo = this.clientLists.find((elm) => elm.id === Number(this.selectedClient));
            const user_and_client_info = {
                userDetails: this.userInfo,
                clientDetails: clientInfo
            };
            console.log("==XObserver==>", user_and_client_info);
            CyncConstants.setUserInfo(user_and_client_info);
            this._helper.setSelectedUserAndClient(user_and_client_info);
        }
    }

    checkAngularPageRequiresClient(path): boolean {
        let flag = false;
        if (path !== undefined && path.indexOf(CyncConstants.ANGULAR_PATH_SEPARATOR) != -1) {
            let angularRoutePath = path.split(CyncConstants.ANGULAR_PATH_SEPARATOR)[1];
            for (let i = 0; i < MenuPaths.CLIENT_REQUIRED_MENU_PATHS.length; i++) {
                let listPath = MenuPaths.CLIENT_REQUIRED_MENU_PATHS[i];
                if (this.matches(listPath, angularRoutePath)) {
                    flag = true;
                }
            }
        }
        return flag;
    }

    /**
     * This method accepts the menus array from api and stores all the menus in a List of Maps
     * where each map will contain submenus with key as menu name and value as MenuBreadCrumbModel
     * @param menus
     * @param menuBreadCrumbMap
     * @param menusArr
     */
    populateMenuMap(menus: any[], menuBreadCrumbMap: Map<string, MenuBreadCrumbModel>, menusArr: any[]): any[] {

        for (let i = 0; i < menus.length; i++) {

            let menu = menus[i];
            if (menu.sub_menu_list.length > 0) {
                if (menuBreadCrumbMap.size > 0) {
                    menusArr.push(menuBreadCrumbMap);
                    menuBreadCrumbMap = new Map<string, MenuBreadCrumbModel>();
                }

                menusArr = this.populateMenuMap(menu.sub_menu_list, new Map<string, MenuBreadCrumbModel>(), menusArr);

            } else {
                let menuName = menu.menu_name;
                let breadCrumb = menu.parent_path.split(',');
                let path = menu.path;
                let isClientIdRequired = false;

                //If <id> is present then clientId is required for that menu

                if ((path.indexOf("<id>") != -1) || this.checkAngularPageRequiresClient(path)) {
                    isClientIdRequired = true;
                }

                //This code needs to be removed once all the new paths are added in api
                //Take api path if the menu name is not present in angular contants file
                // if (MenuPaths.MENU_PATH_MAP.get(menuName) != null && MenuPaths.MENU_PATH_MAP.get(menuName) != undefined) {
                //     path = MenuPaths.MENU_PATH_MAP.get(menuName);
                // }

                let menuBreadCrumb = new MenuBreadCrumbModel();
                menuBreadCrumb.menuName = menuName;
                menuBreadCrumb.breadCrumb = breadCrumb;
                menuBreadCrumb.path = path;
                menuBreadCrumb.isClientIdReqd = isClientIdRequired;
                menuBreadCrumbMap.set(menuName, menuBreadCrumb);
                //subMenusArr.push(menuBreadCrumbMap);
            }


        }

        if (menuBreadCrumbMap.size > 0)
            menusArr.push(menuBreadCrumbMap);
        return menusArr;
    }

    /**
     * This method returns the selectedmenus model (which contains selected menu and all the adjacent menus) from list of menus based on the current path
     * @param path
     * @param subMenuArr
     */
    searchByPath(path: string, subMenuArr: any[]): SelectedMenuModel {
        for (let i = 0; i < subMenuArr.length; i++) {
            let menuMap: Map<string, MenuBreadCrumbModel> = subMenuArr[i];
            let menusArr = Array.from(menuMap.values());
            for (let j = 0; j < menusArr.length; j++) {
                let menuBreadCrumbModel: MenuBreadCrumbModel = menusArr[j];

                //Check If Angular menu
                let subMenuPath = menuBreadCrumbModel.path;
                if (menuBreadCrumbModel.path.indexOf(CyncConstants.ANGULAR_PATH_SEPARATOR) != -1) {
                    subMenuPath = menuBreadCrumbModel.path.split(CyncConstants.ANGULAR_PATH_SEPARATOR)[1];
                }

                if (path.includes('generalCodes/content') && subMenuPath.includes('generalCodes/content')) {
                    let selectedMenuModel = new SelectedMenuModel();
                    selectedMenuModel.menuName = menuBreadCrumbModel.menuName;
                    selectedMenuModel.adjacentMenus = menuMap;
                    return selectedMenuModel;
                } else if (this.matches(path, subMenuPath)) {
                    let selectedMenuModel = new SelectedMenuModel();
                    selectedMenuModel.menuName = menuBreadCrumbModel.menuName;
                    selectedMenuModel.adjacentMenus = menuMap;
                    return selectedMenuModel;
                }
            }
        }
    }

    /**
     * This method returns the parent path for menus with radio buttons
     * @param path
     */
    getParentPathForSubMenus(path: string): string {
        let parentPath = '';
        let menuPathMapEntries = Array.from(MenuPaths.MENU_PATH_WITH_RADIO_BUTTONS.entries());
        for (let l = 0; l < menuPathMapEntries.length; l++) {
            let menuPathEntry = menuPathMapEntries[l];
            let radioButtonMenus = menuPathEntry[1];
            for (let m = 0; m < radioButtonMenus.length; m++) {
                let radioButtonMenuPath = radioButtonMenus[m];
                if (this.containsPath(path, radioButtonMenuPath) || path.toLowerCase().indexOf(radioButtonMenuPath) !== -1) {
                    parentPath = menuPathEntry[0];
                    return parentPath;
                }
            }
        }

        return parentPath;
    }

    /**
     * This method validates if the current location path matches with the path coming from menus api
     * @param path1
     * @param path2
     */
    matches(path1: string, path2: string): boolean {
        if (path1.charAt(0) == MENU_PATH_SEPARATOR && path2.charAt(0) != MENU_PATH_SEPARATOR) {
            path2 = MENU_PATH_SEPARATOR + path2;
        } else if (path1.charAt(0) != MENU_PATH_SEPARATOR && path2.charAt(0) == MENU_PATH_SEPARATOR) {
            path2 = path2.substr(1);
        }

        if (path1 == path2) {
            return true;
        }

        return false;
    }

    /**
     * This method validates if the current location path starts with the path coming from menus api
     * @param path1
     * @param path2
     */
    containsPath(path1: string, path2: string): boolean {
        if (path1.charAt(0) == MENU_PATH_SEPARATOR && path2.charAt(0) != MENU_PATH_SEPARATOR) {
            path2 = MENU_PATH_SEPARATOR + path2;
        } else if (path1.charAt(0) != MENU_PATH_SEPARATOR && path2.charAt(0) == MENU_PATH_SEPARATOR) {
            path2 = path2.substr(1);
        }

        if (path1.startsWith(path2)) {
            return true;
        }

        return false;
    }

    /**
     * This method provides the list of current menu and all the adjacent menus from the menus list based on menu name
     * @param menuName
     * @param subMenuArr
     */
    searchByMenuName(menuName: string, subMenuArr: any[]): MenuBreadCrumbModel[] {
        for (let i = 0; i < subMenuArr.length; i++) {
            let menuMap: Map<string, MenuBreadCrumbModel> = subMenuArr[i];
            if (menuMap.has(menuName))
                return Array.from(menuMap.values());
        }
    }


    /**
 * This method updates the menu subheadings and breadcrumbs
 * @param currentLocation
 */
    getUpdatedAngularMenuAndBreadCrumb() {
        if (this.subMenusArr != undefined && this.subMenusArr.length > 0) {
            let arrMenus = this.subMenusArr;
            let currentLocation = window.location.href;
            let isMenuCopyReqd = false;
            let selectedMenuModel: SelectedMenuModel;

            //If it is an angular menu
            if (currentLocation.indexOf(CyncConstants.ANGULAR_PATH_SEPARATOR) != -1) {
                let path = currentLocation.split(CyncConstants.ANGULAR_PATH_SEPARATOR)[1];

                let parentPathForRadioButton = this.getPathForCurrentUrl(this._router.url.split('?')[0]);
                selectedMenuModel = this.searchByPath(parentPathForRadioButton, arrMenus);

                //If client id is required then client id is not selected then do not update breadcrumb
                if (this.isClientSelectedForRequiredMenu(selectedMenuModel)) {
                    return;
                }

                //Replace menu path with current radio button path
                if (selectedMenuModel != undefined && !this.matches(path, parentPathForRadioButton)) {
                    let subMenuModelPath = selectedMenuModel.adjacentMenus.get(selectedMenuModel.menuName).path;
                    if (subMenuModelPath.split(CyncConstants.ANGULAR_PATH_SEPARATOR)[1] != undefined && subMenuModelPath.split(CyncConstants.ANGULAR_PATH_SEPARATOR)[1].charAt(0) != MENU_PATH_SEPARATOR && (path.charAt(0) == MENU_PATH_SEPARATOR && parentPathForRadioButton.charAt(0) == MENU_PATH_SEPARATOR)) {
                        path = path.substr(1);
                        parentPathForRadioButton = parentPathForRadioButton.substr(1);
                    }

                    let adjacentMenuCopy = new Map(JSON.parse(JSON.stringify(Array.from(selectedMenuModel.adjacentMenus.entries()))));
                    let selectedMenuModelCopy = new SelectedMenuModel();
                    // let selectedMenuModelCopy = JSON.parse(JSON.stringify(selectedMenuModel));
                    selectedMenuModelCopy.menuName = selectedMenuModel.menuName;
                    selectedMenuModelCopy.adjacentMenus = <Map<string, MenuBreadCrumbModel>>adjacentMenuCopy;
                    isMenuCopyReqd = true;
                    selectedMenuModelCopy.adjacentMenus.get(selectedMenuModelCopy.menuName).path = subMenuModelPath.replace(parentPathForRadioButton, path);
                    if (selectedMenuModelCopy != undefined) {

                        this.angularMenu = Array.from(selectedMenuModelCopy.adjacentMenus.values());
                        this.cyncBreadCrumb = selectedMenuModelCopy.adjacentMenus.get(selectedMenuModelCopy.menuName).breadCrumb;
                        //BookMarked Call method
                        this.bookMarkedItemToggle(this.cyncBreadCrumb);
                    }

                }
            } else {
                selectedMenuModel = this.searchByPath(currentLocation, arrMenus);
            }

            if (selectedMenuModel != undefined && !isMenuCopyReqd) {
                this.angularMenu = Array.from(selectedMenuModel.adjacentMenus.values());
                this.cyncBreadCrumb = selectedMenuModel.adjacentMenus.get(selectedMenuModel.menuName).breadCrumb;
                // console.log("--Load BreadCrumb--",  this.cyncBreadCrumb);
                // BookMarked ToggleMethod Call
                this.bookMarkedItemToggle(this.cyncBreadCrumb);
            }

        }
    }



    getNotifications() {
        // console.log('this.cyncUserId--'+this.cyncUserId)
        let searchParam = [];
        let filter = '';
        searchParam.push("app=" + `CYNC`);
        searchParam.push("vieweruid=" + this.cyncUserId);
        searchParam.push("lender=" + this.lenderId);
        searchParam.push("consider=" + `New`);
        if (searchParam.length > 0) {
            filter = searchParam.join('&');
        }
        let params: URLSearchParams = new URLSearchParams();
        params.set('filter', filter.toString());

        const headers: Headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');
        //headers.append('x-api-key', this.notificationApiKey);
        localStorage.setItem('tt', this.notificationApiKey);
        headers.append('authorization', this.authToken);
        this.http.get(this.notificationUrl + 'notifications', { headers: headers, search: filter })
            .subscribe((res: Response) => {
                this.notifications = res.json();
                /*console.log(":::this.notifications-------",this.notifications);*/
                this.notificationItems = this.notifications['Items'];
                this.notifictionCount = this.notifications['Items'].length;
            }, error => {
                this.showLoading = false;
                if (error.status === 401 || error.status === 409) {
                    this._service.setSessinTimeout(true);
                }
                this._service.handleError(error);
            })
    }

    getAllNotifications() {
        //this._service.setHeight();
        //this.notifictionCount = 0;
        this.notificationSuccessCount = 0;
        this.notificationAlertCount = 0;
        this.notificationErrorCount = 0;
        this.isNotificationLoaded = false;
        this.notificationItems = [];
        let searchParam = [];
        let filter = '';
        searchParam.push("app=" + `CYNC`);
        searchParam.push("vieweruid=" + this.cyncUserId);
        searchParam.push("lender=" + this.lenderId);
        searchParam.push("consider=" + `All`);
        if (searchParam.length > 0) {
            filter = searchParam.join('&');
        }
        let params: URLSearchParams = new URLSearchParams();
        params.set('filter', filter.toString());
        const headers: Headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');
        //headers.append('x-api-key', this.notificationApiKey);
        headers.append('authorization', this.authToken);
        this.http.get(this.notificationUrl + 'notifications', { headers: headers, search: filter })
            .subscribe((res: Response) => {
                this.notifications = res.json();
                this.notificationItemsAll = this.notifications['Items'];
                this.updateFieldsAfterNotificationResponse();
                this.notifictionCountAll = this.notifications['Items'].length;
                this.showClearNotificationMsg = false;
                this.isNotificationLoaded = true;
            }, error => {
                this.showLoading = false;
                if (error.status === 401 || error.status === 409) {
                    this._service.setSessinTimeout(true);
                }
                this._service.handleError(error);
            })
    }

    getViewedNotifications() {
        let searchParam = [];
        let filter = '';
        searchParam.push("app=" + `CYNC`);
        searchParam.push("vieweruid=" + this.cyncUserId);
        searchParam.push("lender=" + this.lenderId);
        searchParam.push("consider=" + `All`);
        if (searchParam.length > 0) {
            filter = searchParam.join('&');
        }
        let params: URLSearchParams = new URLSearchParams();
        params.set('filter', filter.toString());

        const headers: Headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');
        //headers.append('x-api-key', this.notificationApiKey);
        headers.append('authorization', this.authToken);
        this.http.get(this.notificationUrl + 'notifications', { headers: headers, search: filter })
            .subscribe((res: Response) => {
                this.getNotifications();
                this.showClearNotificationMsg = true;
            }, error => {
                this.showLoading = false;
                if (error.status === 401 || error.status === 409) {
                    this._service.setSessinTimeout(true);
                }
                this._service.handleError(error);
            })
    }

    markAllRead() {
        this.notifictionCount = 0
        this.notificationSuccessCount = 0;
        this.notificationAlertCount = 0;
        this.notificationErrorCount = 0;
        this.isNotificationLoaded = false;
        this.notificationItems = [];
        let searchParam = [];
        let filter = '';
        searchParam.push("app=" + `CYNC`);
        searchParam.push("vieweruid=" + this.cyncUserId);
        searchParam.push("lender=" + this.lenderId);
        searchParam.push("consider=" + `All`);
        if (searchParam.length > 0) {
            filter = searchParam.join('&');
        }
        let params: URLSearchParams = new URLSearchParams();
        params.set('filter', filter.toString());
        const headers: Headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');
        //headers.append('x-api-key', this.notificationApiKey);
        headers.append('authorization', this.authToken);
        this.http.get(this.notificationUrl + 'notifications', { headers: headers, search: filter })
            .subscribe((res: Response) => {
                this.notifications = res.json();
                this.notificationItemsAll = this.notifications['Items'];
                this.notifictionCountAll = this.notifications['Items'].length;
                this.showClearNotificationMsg = false;
                this.isNotificationLoaded = true;
            }, error => {
                this.showLoading = false;
                if (error.status === 401 || error.status === 409) {
                    this._service.setSessinTimeout(true);
                }
                this._service.handleError(error);
            })
        this.viewAllNotifications = false;

    }

    displayAllNotifications() {
        if (!this.viewAllNotifications) {
            this.viewAllNotifications = true;
            //this._service.setHeight();

            // Fixes for CYNCUXT-2527 Starts
            let window_height = window.innerHeight;
            this.modal_height = (window_height * 60 / 100);
            // Fixes for CYNCUXT-2527 Ends

        } else {
            this.viewAllNotifications = false;
            this.showClearNotificationMsg = false;
        }
        this.getAllNotifications();
    }

    /**
     *
     * @param uploadedfileid
     */
    getUploadedFileNotification(uploadedfileid: number) {
        if (!this.viewAllNotifications) {
            this.viewAllNotifications = true;
            let window_height = window.innerHeight;
            this.modal_height = (window_height * 60 / 100);
        } else {
            this.viewAllNotifications = false;
            this.showClearNotificationMsg = false;
        }
        this.notificationSuccessCount = 0;
        this.notificationAlertCount = 0;
        this.notificationErrorCount = 0;
        this.isNotificationLoaded = false;
        this.notificationItems = [];
        let searchParam = [];
        let filter = '';
        searchParam.push("app=" + `CYNC`);
        searchParam.push("vieweruid=" + this.cyncUserId);
        searchParam.push("lender=" + this.lenderId);
        searchParam.push("consider=" + `All`);
        searchParam.push("borrowerid=" + CyncConstants.getSelectedClient());
        searchParam.push("uploadedfileid=" + uploadedfileid);
        if (searchParam.length > 0) {
            filter = searchParam.join('&');
        }
        let params: URLSearchParams = new URLSearchParams();
        params.set('filter', filter.toString());
        const headers: Headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');
        //headers.append('x-api-key', this.notificationApiKey);
        headers.append('authorization', this.authToken);
        this.http.get(this.notificationUrl + 'notifications', { headers: headers, search: filter })
            .subscribe((res: Response) => {
                this.notifications = res.json();
                this.notificationItemsAll = this.notifications['Items'];
                this.updateFieldsAfterNotificationResponse();
                this.notifictionCountAll = this.notifications['Items'].length;
                this.showClearNotificationMsg = false;
                this.isNotificationLoaded = true;
            }, error => {
                this.showLoading = false;
                if (error.status === 401 || error.status === 409) {
                    this._service.setSessinTimeout(true);
                }
                this._service.handleError(error);
            })
    }


    setNotificationCount() {
        this.viewAllNotifications = false;
    }

    expandNotification() {
        this.expandAllNotifications = false;
    }

    clearAllNotifications() {
        const headers: Headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');
        //headers.append('x-api-key', this.notificationApiKey);
        headers.append('authorization', this.authToken);
        let options = new RequestOptions({ headers: headers });
        const notificationModel = {
            "app": "CYNC",
            "vieweruid": this.cyncUserId.toString(),
            //   "category": "N",
            //    "owneruid": "1",
            "lender": this.lenderId
        };
        this.http.post(this.notificationUrl + 'notifications/clear', notificationModel, options)
            .subscribe((res: Response) => {
                this.getViewedNotifications();

            }, error => {
                this.showLoading = false;
                if (error.status === 401) {
                    this._service.setSessinTimeout(true);
                }
                this._service.handleError(error);
            })
        this.notifictionCountAll = 0;
    }

    clearSingleNotification(notificationItem: any) {
        const headers: Headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');
        //headers.append('x-api-key', this.notificationApiKey);
        headers.append('authorization', this.authToken);
        let options = new RequestOptions({ headers: headers });
        const notificationModel = {
            "app": notificationItem.app,
            "vieweruid": notificationItem.vieweruid,
            "category": notificationItem.category,
            "owneruid": notificationItem.owneruid,
            "lender": notificationItem.lender,
            "ids": notificationItem.nid
        };
        this.http.post(this.notificationUrl + 'notifications/clear', notificationModel, options)
            .subscribe((res: Response) => {
                this.getAllNotifications();
            }, error => {
                this.showLoading = false;
                if (error.status === 401) {
                    this._service.setSessinTimeout(true);
                }
                this._service.handleError(error);
            })
    }

    updateFieldsAfterNotificationResponse() {
        if (this.notificationItemsAll.length == 0) {
            this.notifictionCount = 0;
            this.notifictionCountAll = 0;
            this.showClearNotificationMsg = true;
        } else {
            for (var i = 0; i < this.notificationItemsAll.length; ++i) {
                if (this.notificationItemsAll[i].category == "S") {
                    this.notificationSuccessCount++;
                }
                if (this.notificationItemsAll[i].category == "N" || this.notificationItemsAll[i].category == "W") {
                    this.notificationAlertCount++;
                }
                if (this.notificationItemsAll[i].category == "E") {
                    this.notificationErrorCount++;
                }
            }
        }
        if ((this.notificationSuccessCount > 0 && this.notificationAlertCount == 0 && this.notificationErrorCount == 0) ||
            (this.notificationSuccessCount == 0 && this.notificationAlertCount > 0 && this.notificationErrorCount == 0) ||
            (this.notificationSuccessCount == 0 && this.notificationAlertCount == 0 && this.notificationErrorCount > 0)) {

            this.expandAllNotifications = false;
            this.isExpandStyleVisible = true;
            this.isdisableToggle = true;
        }
        if ((this.notificationSuccessCount > 0 && this.notificationAlertCount > 0 && this.notificationErrorCount == 0) ||
            (this.notificationSuccessCount == 0 && this.notificationAlertCount > 0 && this.notificationErrorCount > 0) ||
            (this.notificationSuccessCount > 0 && this.notificationAlertCount == 0 && this.notificationErrorCount > 0)) {

            this.showTwoColNotification = true;
        }
        if ((this.notificationSuccessCount > 0 && this.notificationAlertCount > 0 && this.notificationErrorCount > 0)) {
            this.showTwoColNotification = false;
        }
    }

    getLastFiveDaysNotifications() {
        let searchParam = [];
        let filter = '';
        searchParam.push("app=" + `CYNC`);
        searchParam.push("vieweruid=" + this.cyncUserId);
        searchParam.push("lender=" + this.lenderId);
        searchParam.push("consider=" + `ViewAll`);
        if (searchParam.length > 0) {
            filter = searchParam.join('&');
        }
        let params: URLSearchParams = new URLSearchParams();
        params.set('filter', filter.toString());

        const headers: Headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');
        //headers.append('x-api-key', this.notificationApiKey);
        headers.append('authorization', this.authToken);
        this.http.get(this.notificationUrl + 'notifications', { headers: headers, search: filter })
            .subscribe((res: Response) => {
                this.notifications = res.json();
                /*console.log(":::this.notifications-------",this.notifications);*/
                this.notificationItemsAll = this.notifications['Items'];
                this.notifictionCountAll = this.notifications['Items'].length;
                this.showClearNotificationMsg = false;
                this.updateFieldsAfterNotificationResponse();

            }, error => {
                this.showLoading = false;
                if (error.status === 401 || error.status === 409) {
                    this._service.setSessinTimeout(true);
                }
                this._service.handleError(error);
            })
    }

    getDateString(tmpDate: any) {
        let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        let monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        let updatedDate = new Date(tmpDate);
        let dayName = days[updatedDate.getDay()];
        let monName = monthNames[updatedDate.getMonth()];
        let dateString = dayName + ", " + updatedDate.getDate() + " " + monName + " " + updatedDate.getFullYear();
        return dateString;
    }

    getTimeString(tempDate: any) {
        let updatedDate = new Date(tempDate);
        let lenderInfo = this.lenderInfo;
        let lenderDetails = lenderInfo['lender_details'];
        let lenderTimeZone = lenderDetails.basic_information.time_zone;
        let timeString = moment(updatedDate).tz(lenderTimeZone).format('hh:mm:ss A');
        return timeString;
    }

    showClearNotificationMsg: boolean = false;


    displayThemeSettings() {
        if (this.selectedUserTheme === 'theme_1') {
            this.selectedTheme_1 = true;
            this.selectedTheme_2 = false;
            this.selectedTheme_3 = false;
            this.selectedTheme_0 = false;
        } else if (this.selectedUserTheme === 'theme_2') {
            this.selectedTheme_2 = true;
            this.selectedTheme_1 = false;
            this.selectedTheme_3 = false;
            this.selectedTheme_0 = false;
        } else if (this.selectedUserTheme === 'theme_0') {
            this.selectedTheme_2 = false;
            this.selectedTheme_1 = false;
            this.selectedTheme_3 = false;
            this.selectedTheme_0 = true;
        } else {
            this.selectedTheme_3 = true;
            this.selectedTheme_1 = false;
            this.selectedTheme_2 = false;
            this.selectedTheme_0 = false;
        }
        document.getElementById('modal_settings_overlay').style.display = 'block';
        document.getElementById('modal_settings').style.display = 'block';
    }

    hideThemeSettings() {
        $("#cync_app_dashboard").removeClass();
        $("#cync_app_dashboard").addClass(this.selectedUserTheme);
        document.getElementById('modal_settings_overlay').style.display = 'none';
        document.getElementById('modal_settings').style.display = 'none';
    }

    getLenderInfo() {
        const headers: Headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append('authorization', this.authToken);
        headers.set('Access-Control-Allow-Origin', '*');
        headers.set('Access-Control-Allow-Headers', 'access-control-allow-headers,access-control-allow-origin');
        let options = new RequestOptions({ headers: headers });
        this.http.get(this.serviceUrl + 'lender', options)
            .subscribe((res: Response) => {
                this.lenderInfo = res.json();
                this.footerInfo = this.lenderInfo['lender_details'].display_links;
                if (this.lenderInfo['lender_details'].basic_information.current_logo != undefined) {
                    this.headerLogo = this.lenderInfo['lender_details'].basic_information.current_logo;
                } else {
                    this.headerLogo = this.lenderInfo['lender_details'].basic_information.logo_path;
                }
                CyncConstants.setMultiFactorAuth(this.lenderInfo['lender_details'].basic_information.multi_factor_auth);
                CyncConstants.setLenderTimezone(this.lenderInfo['lender_details'].basic_information.time_zone);
                CyncConstants.setAutomaticMailValue(this.lenderInfo['lender_details'].password_details.automatic_emails);
            }, error => {
                this.showLoading = false;
                if (error.status === 401 || error.status === 409) {
                    this._service.setSessinTimeout(true);
                }
                this._service.handleError(error);
            })
    }


    getBuildVersion() {
        const headers: Headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append('authorization', this.authToken);
        headers.set('Access-Control-Allow-Origin', '*');
        headers.set('Access-Control-Allow-Headers', 'access-control-allow-headers,access-control-allow-origin');
        let options = new RequestOptions({ headers: headers });
        this.http.get(this.serviceUrl + 'versions', options)
            .subscribe((res: Response) => {
                this.buildInformation = res.json();
            }, error => {
                this.showLoading = false;
                if (error.status === 401 || error.status === 409) {
                    this._service.setSessinTimeout(true);
                }
                this._service.handleError(error);
            })
    }


    applyThemeSettings() {
        const headers: Headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append('authorization', this.authToken);
        headers.set('Access-Control-Allow-Origin', '*');
        headers.set('Access-Control-Allow-Headers', 'access-control-allow-headers,access-control-allow-origin');
        let options = new RequestOptions({ headers: headers });
        if (this.selectedTheme === undefined) {
            this.selectedTheme = '';
        }
        const themeModel = {
            "theme-name": this.selectedTheme
        }

        this.http.post(this.serviceUrl + 'theme', themeModel, options)
            .subscribe((res: Response) => {
                location.reload();
            }, error => {
                this.showLoading = false;
                if (error.status === 401) {
                    this._service.setSessinTimeout(true);
                }
                this._service.handleError(error);
            })
    }

    cyncLogout() {
        localStorage.clear();
        window.location.href = "https://" + window.location.hostname.split('.')[0] + ".cyncsoftware.com/users/sign_out";
    }

    selectCyncTheme(theme, event) {
        $("#cync_app_dashboard").removeClass();
        $("#cync_app_dashboard").addClass(theme);

        if (theme === 'theme_0' && event === true) {
            this.selectedTheme_0 = true;
            this.selectedTheme = 'pearl_layout';
        } else {
            this.selectedTheme_0 = false;
        }


        if (theme === 'theme_1' && event === true) {
            this.selectedTheme_1 = true;
            this.selectedTheme = 'officeblue_layout';
        } else {
            this.selectedTheme_1 = false;
        }

        if (theme === 'theme_2' && event === true) {
            this.selectedTheme_2 = true;
            this.selectedTheme = 'green_layout';
        } else {
            this.selectedTheme_2 = false;
        }

        if (theme === 'theme_3' && event === true) {
            this.selectedTheme_3 = true;
            this.selectedTheme = '';
        } else {
            this.selectedTheme_3 = false;
        }
        //this.selectedTheme = theme;
    }

    /**
     * This method updates the bread crumb and in case client selection is required then shows alert message
     * @param event
     * @param path
     */
    updateBreadCrumbAndCheckClientSelection(event: any, path: string) {
        let currentUrl = path.split('#')[1];
        //Incase it a ror menu
        if (!(currentUrl != undefined && currentUrl != null && currentUrl.length > 0)) {
            currentUrl = path;
        }
        let tempvar = CyncConstants.getSelectedClient();
        if (((path.indexOf("<id>") !== -1) || this.checkAngularPageRequiresClient(path)) && !this._helper.isClientSelected()) {
            event.preventDefault();
            if ((path.indexOf("<id>") !== -1))
                this._helper.openAlertPoup("Information", CyncConstants.CLIENT_SELECTION_MESSAGE);
            return;
        }
        let selectedMenuModel;
        if (currentUrl === '/uploads/upload-bbc-data-files') {
            selectedMenuModel = this.searchByPath('/uploads', this.subMenusArr);
        } else {
            selectedMenuModel = this.searchByPath(currentUrl, this.subMenusArr);
        }
        let selectedMenuBreadCrumbModel = selectedMenuModel.adjacentMenus.get(selectedMenuModel.menuName);

        //If client id is required then client id is not selected then do not update breadcrumb
        if (this.isClientSelectedForRequiredMenu(selectedMenuModel)) {
            return;
        }

        this.cyncBreadCrumb = selectedMenuBreadCrumbModel.breadCrumb;
        this.angularMenu = Array.from(selectedMenuModel.adjacentMenus.values());
        // console.log("==LinkNagivationClick=",this.cyncBreadCrumb);
        // BookMarked Toggle Method Call
        this.bookMarkedItemToggle(this.cyncBreadCrumb);
    }

    navigateToRor($event) {
        if (this.editForm == true) {
            this._helper.alertMessge();
            return false;
        } else {
            let event1 = $event;
            if (document.getElementById('primary_menu_container') != undefined && document.getElementById('primary_menu_container') != null && $(event1.target).attr('type') !== 'text' && ($(event1.target).attr('class') != undefined && !$(event1.target).attr('class').includes('menuSearchCloseIcon'))) {

                document.getElementById('primary_menu_container').style.display = 'none';
                document.getElementById('menu_overlayout_pannel').style.display = 'none';
                this.isNavActive = false;
                this.showPrimaryMenu = false;
            }
            let path = decodeURIComponent(($event.target.href));
            this.updateBreadCrumbAndCheckClientSelection(event1, path);
        }

    }

    listClients() {
        this.clientListArray = [];
        const headers: Headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append('authorization', this.authToken);
        headers.set('Access-Control-Allow-Origin', '*');
        headers.set('Access-Control-Allow-Headers', 'access-control-allow-headers,access-control-allow-origin');
        let options = new RequestOptions({ headers: headers });
        //console.log('this.selectedManager--'+this.selectedManager)

        this.clientListArray.push({ label: this.selectClientPlaceHolder, value: CyncConstants.SELECT_CLIENT_PLACEHOLDER });

        if (this.selectedManager == undefined || this.selectedManager === 'Select Manager') {
            this.http.get(this.serviceUrl + 'borrowers', options)
                .subscribe((res: Response) => {
                    this.clients = res.json();
                    this.clientLists = this.clients['borrowers'];

                    if (this.clientLists.length > 0) {

                        for (let i = 0; i < this.clientLists.length; i++) {
                            let obj = this.clientLists[i];
                            let clientObj = { label: obj.client_name, value: obj.id };
                            this.clientListArray.push(clientObj);
                        }
                        if (CyncConstants.getSelectedClient()) {
                            this.selectedClient = CyncConstants.getSelectedClient();
                        }
                        /*console.log(":::BASED ON MANAGER this.clientListArray-------",this.clientListArray);*/
                        //this.setManagerAndClient();
                    } else {
                        let clientObj = { label: "No Results Found", value: null };
                        this.clientListArray.push(clientObj);
                    }

                    //this.getMenus();
                    this.loadMenuMap();
                    this.getCurrentSession().subscribe((res1) => {
                        console.info("==Current Session=>", res1);
                        let tempCurrentSeesion = res1;

                        if (res1.current_session_state.manager_id != null) {
                            let manager_id: string = res1.current_session_state.manager_id;
                            this.selectedManager = manager_id.toString();
                        }
                        if (res1.current_session_state.borrower_id != null) {
                            let client_id: string = res1.current_session_state.borrower_id;
                            this._helper.setClientID(client_id);
                            this.selectedClient = client_id.toString();
                        }

                        if ((res1.current_session_state.borrower_status === null) || (res1.current_session_state.borrower_status === "1")) {
                            this.selectedClientStatus = Number(res1.current_session_state.borrower_status);
                            this.activeClientList();
                        }
                        if (res1.current_session_state.borrower_status === "2") {
                            this.selectedClientStatus = Number(res1.current_session_state.borrower_status);
                            this.inActiveClient();
                        }
                        if (res1.current_session_state.borrower_status === "0") {
                            this.selectedClientStatus = Number(res1.current_session_state.borrower_status);
                            this.allClientsList();

                        }

                    }, error => {
                        this.showLoading = false;
                        if (error.status === 401 || error.status === 409) {
                            this._service.setSessinTimeout(true);
                        }
                        this._service.handleError(error);
                    });
                }, error => {
                    this.showLoading = false;
                    if (error.status === 401 || error.status === 409) {
                        this._service.setSessinTimeout(true);
                    }
                    this._service.handleError(error);
                })
        } else {
            /*console.log("::::this.selectedManager-----",this.selectedManager);*/
            //let borrowerURL = this.serviceUrl+'borrowers?manager_id='+this.selectedManager;
            //console.log("borrowerURL-----",borrowerURL);
            this.http.get(this.serviceUrl + 'borrowers?manager_id=' + this.selectedManager, options)
                .subscribe((res: Response) => {
                    this.clients = res.json();
                    this.clientLists = this.clients['borrowers'];
                    if (this.clientLists.length > 0) {

                        for (let i = 0; i < this.clientLists.length; i++) {
                            let obj = this.clientLists[i];
                            let clientObj = { label: obj.client_name, value: obj.id };
                            this.clientListArray.push(clientObj);
                        }
                        this.activeClientList();
                        /*console.log(":::BASED ON MANAGER this.clientListArray-------",this.clientListArray);*/
                        //this.setManagerAndClient();
                    } else {
                        let clientObj = { label: "No Results Found", value: null };
                        this.clientListArray.push(clientObj);
                    }

                    //this.getMenus();
                    this.loadMenuMap();
                }, error => {
                    this.showLoading = false;
                    if (error.status === 401 || error.status === 409) {
                        this._service.setSessinTimeout(true);
                    }
                    this._service.handleError(error);
                })
        }
    }

    listManagers() {
        const headers: Headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append('authorization', this.authToken);
        headers.set('Access-Control-Allow-Origin', '*');
        headers.set('Access-Control-Allow-Headers', 'access-control-allow-headers,access-control-allow-origin');
        let options = new RequestOptions({ headers: headers });
        this.http.get(this.serviceUrl + 'borrowers/get_managers_list', options)
            .subscribe((res: Response) => {
                this.managers = res.json();
                this.managerLists = this.managers['managers'];
                this.managerListArray.push({ label: 'Select Manager', value: 'Select Manager' });
                for (let i = 0; i < this.managerLists.length; i++) {
                    let obj = this.managerLists[i];
                    let managerObj = { label: obj.user_name, value: obj.id };
                    this.managerListArray.push(managerObj);
                }
                /*console.log(":::this.managerListArray-------",this.managerListArray);*/
                // this.setManagerAndClient();
            }, error => {
                this.showLoading = false;
                if (error.status === 401 || error.status === 409) {
                    this._service.setSessinTimeout(true);
                }
                this._service.handleError(error);
            })
    }

    // onchange function for client selection drop-down
    onChangeevent(event) {
        if (this.selectedClient) {
            let clientInfo = this.clientLists.find((elm) => elm.id === Number(this.selectedClient));
            if (clientInfo.active === true) {
                this.selectedClientStatus = 1;
            } else {
                this.selectedClientStatus = 2;
            }
        }

        let keyBoard = event.originalEvent.key;
        if (keyBoard != 'ArrowDown' && keyBoard != 'ArrowUp') {
            if (this.editForm == true) {
                this._helper.alertMessge();
                return false;
            } else {
                this.setBorrower();
            }
        }
    }


    // main function for client selection drop-down
    setBorrower() {
        this.currentClient = '';
        this.currentClient = this.selectedClient;

        /**
         * @see https://idexcel.atlassian.net/browse/CYNCPS-2086
         * Moving the following code inside the HTTP call, set the client only after getting response from Server
         * console.log(":::this.selectedClient-------",this.selectedClient);
         * CyncConstants.setSelectedClient(this.selectedClient);
         * this._clientSelectionService.add(this.selectedClient);
         * localStorage.setItem('selectedClient', this.selectedClient);
         */

        if (this.selectedClient != null) {
            const headers: Headers = new Headers();
            headers.append('Accept', 'application/json');
            headers.append('Content-Type', 'application/json');
            headers.append('authorization', this.authToken);
            headers.set('Access-Control-Allow-Origin', '*');
            headers.set('Access-Control-Allow-Headers', 'access-control-allow-headers,access-control-allow-origin');
            let options = new RequestOptions({ headers: headers });
            this.http.get(this.serviceUrl + 'set_session_borrower?borrower_id=' + this.selectedClient, options)
                .subscribe((res: Response) => {
                    //this.getMenus();
                    this._helper.setClientID(this.selectedClient);
                    console.log("selected clientID::", this.selectedClient);
                    this.loadMenuMap();
                    // Set New client ID in Constants, Client Service, Local storage.
                    this._clientSelectionService.add(this.selectedClient);
                    localStorage.setItem('selectedClient', this.selectedClient);

                }, error => {
                    this.showLoading = false;
                    if (error.status === 401 || error.status === 409) {
                        this._service.setSessinTimeout(true);
                    }
                    this._service.handleError(error);
                })
        } else {
            let currentSelectedUrl = this.getPathForCurrentUrl(this._router.url);
            let selectedMenuModel = this.searchByPath(currentSelectedUrl, this.subMenusArr);
            //If client id is required then navigate back to home page and clear breadcrumb and menu navbar
            if (this.isClientSelectedForRequiredMenu(selectedMenuModel)) {
                this._helper.openAlertPoup("Information", CyncConstants.CLIENT_SELECTION_MESSAGE);
                this._router.navigate(['../../'], { relativeTo: this.route });
                this.angularMenu = [];
                this.cyncBreadCrumb = [];
            }

        }

    }


    /**
     * Check if client Id is selected for menu that requires client id
     * @param selectedMenuModel
     */
    isClientSelectedForRequiredMenu(selectedMenuModel: SelectedMenuModel): boolean {
        return ((selectedMenuModel != undefined) && (selectedMenuModel.adjacentMenus.get(selectedMenuModel.menuName) != undefined) && selectedMenuModel.adjacentMenus.get(selectedMenuModel.menuName).isClientIdReqd && (!this._helper.isClientSelected()));
    }

    /**
     *
     */
    setCurrentSession(): Observable<any> {
        if (this.selectedClient != null) {
            const headers: Headers = new Headers();
            headers.append('Accept', 'application/json');
            headers.append('Content-Type', 'application/json');
            headers.append('authorization', this.authToken);
            headers.set('Access-Control-Allow-Origin', '*');
            headers.set('Access-Control-Allow-Headers', 'access-control-allow-headers,access-control-allow-origin');
            let options = new RequestOptions({ headers: headers });
            return this.http.get(this.serviceUrl + 'set_session_borrower?borrower_id=' + this.selectedClient, options);
        }
    }

    /**
     *
     */
    getCurrentSession(): Observable<any> {
        const http_header: HttpHeaders = new HttpHeaders({
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': this.authToken,
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'access-control-allow-headers,access-control-allow-origin',
            'lenderId': this.config.getConfig('lenderId')
        });
        return this.httpClient.get(this.serviceUrl + '/current_session_state', { headers: http_header });
    }

    /**
     * In case the page has radio button navigations then get the parent path for the submenu
     * @param url
     */
    getPathForCurrentUrl(url: string): string {
        let parentPathForRadioButton = this.getParentPathForSubMenus(url);
        if (parentPathForRadioButton == undefined || parentPathForRadioButton.length == 0) {
            parentPathForRadioButton = url;
        }
        return parentPathForRadioButton;
    }

    setManager() {
        const headers: Headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append('authorization', this.authToken);
        headers.set('Access-Control-Allow-Origin', '*');
        headers.set('Access-Control-Allow-Headers', 'access-control-allow-headers,access-control-allow-origin');
        let options = new RequestOptions({ headers: headers });
        this.http.get(this.serviceUrl + 'set_session_manager?manager_id=' + this.selectedManager, options)
            .subscribe((res: Response) => {
                //this.getMenus();
                this.loadMenuMap();
                this.clientLists = [];
                this.selectedClient = null;
                this.listClients();
            }, error => {
                this.showLoading = false;
                if (error.status === 401 || error.status === 409) {
                    this._service.setSessinTimeout(true);
                }
                this._service.handleError(error);
            })
    }

    setManagerAndClient() {
        const headers: Headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append('authorization', this.authToken);
        headers.set('Access-Control-Allow-Origin', '*');
        headers.set('Access-Control-Allow-Headers', 'access-control-allow-headers,access-control-allow-origin');
        let options = new RequestOptions({ headers: headers });

        /*Below Call is to set the selected Manager and Selected Client when travelling from ror to angular page*/
        this.http.get(this.serviceUrl + '/current_session_state', options).subscribe((res1: Response) => {


            this.listClients();
            this.listManagers();
        }, error => {
            this.showLoading = false;
            if (error.status === 401 || error.status === 409) {
                this._service.setSessinTimeout(true);
            }
            this._service.handleError(error);
        })
    }



    hideClose() {
        this.cync_MenuSearch = null;
        this.hideIcon = false;
    }

    mouseEnter(menu: any) {
        const searchPannel = <HTMLElement>document.getElementById('search_bar');
        //console.log('inside mouse enter: '+JSON.stringify(subMenu));
        this.currentMenuSelected = menu.menu_name;
        if (menu.sub_menu_list.length > 0) {
            this.subMenuList = menu.sub_menu_list;
            this.showSubMenu = true;
            searchPannel.style.width = '225px';
        } else {
            this.subMenuList = [];
            this.showSubMenu = false;
            this.setPrimaryMenuContainerInitialWidth();
        }
    }


    /*Method to filter the menu by search term*/
    menuSearchInput: string = '';
    hideMenu: boolean = false;
    hideMenuSearchList: boolean = true;
    searchListArr: any[] = [];
    showResultMsg: boolean = false;

    searchFromMenuList() {
        const searchPannel = <HTMLElement>document.getElementById('search_bar');
        /*Get the search results only after 3 letters are entered*/
        if (this.menuSearchInput.length > 2) {
            if (document.getElementById('primary_menu_container') != null && document.getElementById('primary_menu_container') != undefined) {
                document.getElementById('primary_menu_container').style.width = "40vw";
                this.hideMenuSearchList = false;
                this.hideMenu = true;
                //document.getElementById('submenu_container').style.visibility = "hidden";
                //console.log(this.menuSearchInput);

                searchPannel.style.width = 'auto';
                this.getFilteredArray();
            }

        } else {
            this.hideMenuSearchList = true;
            this.hideMenu = false;
            this.showSubMenu = false;
            searchPannel.style.width = 'auto';
            //document.getElementById('submenu_container').style.visibility = "visible";
            //document.getElementById('submenu_container').style.height = "516px";
            if (document.getElementById('primary_menu_container') != null && document.getElementById('primary_menu_container') != undefined) {
                document.getElementById('primary_menu_container').style.width = "225px";
            }
        }

    }

    getFilteredArray() {
        this.searchListArr = [];
        const headers: Headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append('authorization', this.authToken);
        headers.set('Access-Control-Allow-Origin', '*');
        headers.set('Access-Control-Allow-Headers', 'access-control-allow-headers,access-control-allow-origin');
        let options = new RequestOptions({ headers: headers });
        //console.log("::BEFORE---searchListArr----",this.searchListArr);
        //console.log("::BEFORE---menuSearchInput----",this.menuSearchInput);
        this.http.get(this.serviceUrl + 'menus/search/?borrower_id=' + CyncConstants.getSelectedClient() + '&keyword=' + this.menuSearchInput, options).
            subscribe((res: Response) => {
                this.searchListArr = res.json();
                if (this.searchListArr.length <= 0) {
                    this.showResultMsg = true;
                } else {
                    this.showResultMsg = false;
                    for (let i = 0; i < this.searchListArr.length; i++) {

                        this.searchListArr[i]['parentPathArr'] = this.searchListArr[i].parent_path.split(',');
                    }
                    //console.log("::AFTER---searchListArr----",this.searchListArr);
                }

            }, error => {
                this.showLoading = false;
                if (error.status === 401 || error.status === 409) {
                    this._service.setSessinTimeout(true);
                }
                this._service.handleError(error);
            })
    }


    clearMenuSearch() {
        this.menuSearchInput = '';
        this.hideMenuSearchList = true;
        this.hideMenu = false;
        //document.getElementById('submenu_container').style.visibility = "visible";
        // document.getElementById('submenu_container').style.height= "516px";
        //document.getElementById('primary_menu_container').style.width = "225px";
    }

    public getLastAction() {
        return parseInt(sessionStorage.getItem(STORE_KEY));
    }
    public setLastAction(lastAction: number) {
        sessionStorage.setItem(STORE_KEY, lastAction.toString());
    }

    initListener() {
        document.body.addEventListener('click', () => this.reset());
        document.body.addEventListener('mouseover', () => this.reset());
        document.body.addEventListener('mouseout', () => this.reset());
        document.body.addEventListener('keydown', () => this.reset());
        document.body.addEventListener('keyup', () => this.reset());
        document.body.addEventListener('keypress', () => this.reset());

        //Check Login Status on tab focus
        window.addEventListener('focus', () => this.checkLoginStatus());
    }

    /**
     * Method to check Login Status
     * @see https://idexcel.atlassian.net/browse/CYNCS-2330
     */
    checkLoginStatus() {
        this.getCurrentSession().subscribe((res) => {
            this.showLoading = false;
            if (res.status === 401 || res.status === 409) {
                sessionStorage.clear();
                this.isErrorMessage = false;
                this.showTimeoutPopup = true;
                this._service.setSessinTimeout(true);
                this.Password = "";
            }
            else if (res.status === 200) {
                this.showTimeoutPopup = false;
                sessionStorage.removeItem('lastAction');
            }
        });
    }

    reset() {
        this.setLastAction(Date.now());
    }

    initInterval() {
        Observable.interval(CHECK_INTERVAL).subscribe(x => {
            this.check();
        })
    }

    check() {
        const now = Date.now();
        const timeleft = this.getLastAction() + MINUTES_UNITL_AUTO_LOGOUT * 60 * 1000;
        const diff = timeleft - now;
        const isTimeout = diff < 0;
        if (isTimeout) {
            sessionStorage.clear();
            this.isErrorMessage = false;
            this.showTimeoutPopup = true;
            this._service.setSessinTimeout(true);
            this.Password = "";
        }
    }

    sessionLogin() {
        if (this.Username != "" && this.Password != "") {
            const userloginModel = {
                "user":
                {
                    "login": this.Username,
                    "password": this.Password
                }
            }
            this.requestModel = { url: '/users/sign_in', model: userloginModel }
            this._service.postCallpatchror(this.requestModel).then(i => this.navigateToHome(i));
        }
        else {
            this.isErrorMessage = true;
        }
    }

    navigateToHome(data: any) {
        if (data.status == 200) {
            this.showTimeoutPopup = false;
            this.Password = "";
            sessionStorage.removeItem('lastAction');
        } else {
            localStorage.clear();
            this.cookieService.deleteAll();
            window.location.href = '../../';
        }
    }
    /*showNavigationHeader Method Purpose: On Click of the search result route to the respective path and show navigation header dynamically*/
    showNavigationHeader(event, path) {
        path = decodeURIComponent((path));
        this.updateBreadCrumbAndCheckClientSelection(event, path);
        this.hideMenuSearchList = true;
        this.showPrimaryMenu = false;

        //Reset menu search input value
        this.menuSearchInput = '';
        this.searchFromMenuList();

        if (document.getElementById('primary_menu_container') != undefined && document.getElementById('primary_menu_container') != null) {
            document.getElementById('primary_menu_container').style.display = 'none';
            document.getElementById('menu_overlayout_pannel').style.display = 'none';
            this.isNavActive = false;
        }
    }

    getColumnLength(num: number, den: number): number {
        let value = num / den;

        let col = Math.floor(num / den);

        let diff = value - col;
        if (col == 0 || (diff > 0.5 && den != 3)) { //added this den!=3 condition for factoring
            col = Math.ceil(num / den);
        }

        return col;
    }

    fnExpand() {
        const mop = <HTMLElement>document.getElementById('menu_overlayout_pannel');
        if (!this.isNavActive) {
            mop.style.display = 'block';
            this.showSubMenu = false;
        } else {
            mop.style.display = 'none';
        }
        this.isNavActive = !this.isNavActive;

    }
    setMenuStyles() {
        let styles = {
            'font-size': '18px',
            'weight': '18px',
            'height': '15px'
        };
        return styles;
    }
    getFirstMenu(event: Event) {
        this.setPrimaryMenuContainerInitialWidth();
        this.hideSubMenuList(event);
    }
    getMenuHide(event: Event) {

        const PMC = <HTMLElement>document.getElementById('primary_menu_container');
        const MOP = <HTMLElement>document.getElementById('menu_overlayout_pannel');

        PMC.style.display = 'none';
        MOP.style.display = 'none';

        this.isNavActive = false;
        this.showPrimaryMenu = false;
        this.hideMenuList(event);
    }

    showMenu(event: Event) {
        event.stopPropagation();
        if (this.isNavActive) {
            this.showPrimaryMenu = true;
        } else {
            this.showPrimaryMenu = false;
            this.currentMenuSelected = '';
            this.subMenuList = [];
            this.showSubMenu = false;
        }
        this.currentMenuSelected = '';
        this.setPrimaryMenuContainerInitialWidth();
    }

    hideMenuList(event: any) {
        this.setPrimaryMenuContainerInitialWidth();
        this.showPrimaryMenu = false;
        this.currentMenuSelected = '';
        this.subMenuList = [];
        this.showSubMenu = false;

    }

    hideSubMenuList(event: any) {
        this.subMenuList = [];
        this.showSubMenu = false;
    }

    setPrimaryMenuContainerInitialWidth() {
        if (document.getElementById('primary_menu_container') != undefined)
            document.getElementById('primary_menu_container').style.width = "227px";
    }

    /**
  * This method need to be removed once rorApi gives new menus in response
  * This method manually adds entry for phase 2 menus which have not been included in rorapi yet
  * @param menusArr
  */
    addMissingMenus(menusArr: any[]): any[] {

        //Adding Client Details Menu
        let clientDetails = new Map<string, MenuBreadCrumbModel>();
        let parentClientDetails = "Client Maintenance";
        this.setMenuInMap(menusArr, MenuPaths.CLIENT_DETAILS, parentClientDetails, false, clientDetails);
        this.setMenuInMap(menusArr, MenuPaths.CLIENT_MAPPING, parentClientDetails, false, clientDetails);
        this.setMenuInMap(menusArr, MenuPaths.CLIENT_TRANSACTION_SUMMARY, parentClientDetails, false, clientDetails);
        menusArr.push(clientDetails);


        //Adding BBC Preference Setup Menu
        let bbcPreferenceSetup = new Map<string, MenuBreadCrumbModel>();
        let parent = "BBC Preference Setup"
        this.setMenuInMap(menusArr, MenuPaths.BASIC_PARAMETERS, parent, false, bbcPreferenceSetup);
        this.setMenuInMap(menusArr, MenuPaths.ADVANCE_RATE, parent, true, bbcPreferenceSetup);
        this.setMenuInMap(menusArr, MenuPaths.BUCKET_AGEING, parent, false, bbcPreferenceSetup);
        this.setMenuInMap(menusArr, MenuPaths.OTHER_PREFERENCES, parent, false, bbcPreferenceSetup);
        this.setMenuInMap(menusArr, MenuPaths.COLLATERAL_RESERVES, parent, false, bbcPreferenceSetup);
        this.setMenuInMap(menusArr, MenuPaths.ASSET_AMORTIZATION, parent, false, bbcPreferenceSetup);
        menusArr.push(bbcPreferenceSetup);

        // adding for ABL Uploads
        let ablUploads = new Map<string, MenuBreadCrumbModel>();
        let uploadHeader = "Uploads"
        this.setMenuInMap(menusArr, MenuPaths.ABL_AUTO_FILE_UPLOADS, uploadHeader, false, ablUploads);
        menusArr.push(ablUploads);
        return menusArr;
    }

    /**
     * This method needs to be removed once api gives these menus in response
     * This method is to remove the new menu from the response returned by api and set the new menu in menu array
     * @param menuName
     * @param breadCrumbParent
     * @param isClientIdReqd
     * @param menuMap
     */
    setMenuInMap(menusArr: any[], menuName: string, breadCrumbParent: string, isClientIdReqd: boolean, menuMap: Map<string, MenuBreadCrumbModel>) {
        this.removeMenuFromExistingList(menusArr, menuName);
        let breadCrumbForMenu: string[] = breadCrumbParent.split(',');
        breadCrumbForMenu.push(menuName);
        //  menuMap.set(menuName, this.createMenuBreadCrumbModel(menuName, MenuPaths.MENU_PATH_MAP.get(menuName), breadCrumbForMenu, isClientIdReqd));
    }

    /**
     * This method needs to be removed once api gives these menus in response
     * This method removes th eold menus order and replaces it with the new menu order
     * @param menusArr
     * @param menuName
     */
    removeMenuFromExistingList(menusArr: any[], menuName: string) {
        for (let i = 0; i < menusArr.length; i++) {
            let menuMap: Map<string, MenuBreadCrumbModel> = menusArr[i];
            if (menuMap.has(menuName)) {
                menuMap.delete(menuName);
            }
        }
    }

    /**
     * This method needs to be removed once new menus are included in rorapi response
     * This method is used to create menu model objects for new menus for phase 2 which are not presengt in rorapi
     * @param menuName
     * @param path
     * @param breadCrumb
     * @param isClientIdRequired
     */
    createMenuBreadCrumbModel(menuName: string, path: string, breadCrumb: string[], isClientIdRequired: boolean): MenuBreadCrumbModel {
        let menuBreadCrumbModel = new MenuBreadCrumbModel();
        menuBreadCrumbModel.menuName = menuName;
        menuBreadCrumbModel.path = path;
        menuBreadCrumbModel.breadCrumb = breadCrumb;
        menuBreadCrumbModel.isClientIdReqd = isClientIdRequired;
        return menuBreadCrumbModel;
    }

    /**
     *
     * @param menuName
     * @param subMenuArr
     */
    getMenuByMenuName(menuName: string, subMenuArr: any[]): MenuBreadCrumbModel {
        let menuModel: MenuBreadCrumbModel;
        for (let i = 0; i < subMenuArr.length; i++) {
            let menuMap: Map<any, any> = subMenuArr[i];
            if (menuMap.has(menuName)) {
                menuModel = menuMap.get(menuName);
                break;
            }
        }
        return menuModel;
    }

    homeTrackAction(actionParams: string) {
        let url = `dashboard/home_action_track`;
        let model = {
            'linkpoint': actionParams
        };
        this._navbarService.postAction(url, model).subscribe(result => {
            if (model.linkpoint === 'cync_logo' && result.status === 'success') {
                window.location.href = `${window.origin}`;
            }
            console.log("TrackAction:", result);
        });
    }

    /**
     * Method to give page count for every angular pages
     */
    getPageDisplayCount() {
        let url = this._apiMapper.endpoints[CyncConstants.PAGE_DISPLAY_COUNT];
        this._navbarService.getPageDisplayCount(url).subscribe(result => {
            CyncConstants.setDefaultRowCount(result.value);
        }, error => {
            CyncConstants.setDefaultRowCount(25);
        });
        setTimeout(() => {
            this.userAndClientInfo();
        }, 4500);
    }

    // keydown function for client selection drop-down
    clientKeydown(event) {
        if (event.key === 'Enter') {
            this.setBorrower();
        }

    }

    // focus out function for client selection drop-down
    handlePanelHide() {
        setTimeout(() => {
            if (this.currentClient !== null) {
                this.selectedClient = this.currentClient;
            }
            else {
                return
            }
        }, 600);
    }

    clientStatusOptions() {
        this.clientStatusArray = [
            { label: 'Select Client Status', value: 0 },
            { label: 'Active', value: 1 },
            { label: 'Inactive', value: 2 }
        ]
    }

    onChangeClientStatus(event: any) {
        if (this.selectedClientStatus === 1) {
            this.activeClientList();
        } else if (this.selectedClientStatus === 2) {
            this.inActiveClient();
        } else {
            this.allClientsList();
        }
        this.setSessionBorrowerStatus();
    }

    setSessionBorrowerStatus() {
        let url = `${this.serviceUrl}set_session_borrower_status?borrower_status=${this.selectedClientStatus}`;
        this._navbarService.getService(url).subscribe(respose => {
            console.log(respose);
        });
    }

    inActiveClient() {
        let inActiveClients = [];
        if (this.clients.borrowers.length > 0) {
            this.clients.borrowers.forEach(elm => {
                if (elm.active === false) {
                    inActiveClients.push({ label: elm.client_name, value: elm.id, client_status: elm.active });
                }
            });
        } else {
            inActiveClients.push({ label: "No result found", value: null });
        }

        this.clientListArray = inActiveClients;
    }

    activeClientList() {
        let activeClients = [];
        if (this.clients.borrowers.length > 0) {
            this.clients.borrowers.forEach(elm => {
                if (elm.active === true) {
                    activeClients.push({ label: elm.client_name, value: elm.id, client_status: elm.active });
                }
            });
        } else {
            activeClients.push({ label: "No result found", value: null });
        }
        this.clientListArray = activeClients;

    }

    allClientsList() {
        let allClients = [];
        if (this.clients.borrowers.length > 0) {
            this.clients.borrowers.forEach(element => {
                allClients.push({ label: element.client_name, value: element.id, client_status: element.active })
            });
        } else {
            allClients.push({ label: "No result found", value: null });
        }
        this.clientListArray = allClients;
    }

    isCurrentAppUrl(url: string): boolean {
        return url.includes(this.currentApp);
    }

    isLoanLink(url: string): boolean {
        return url.includes("loan-enquiry") || url.includes("loan-summary");
    }

}
