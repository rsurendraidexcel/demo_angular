import { Component, OnInit, Renderer2 } from "@angular/core";
import { FormGroup, FormBuilder } from "@angular/forms";
import { FactoringFeeSetupService } from "../service/factoring-fee-setup.service";
import { Helper } from "@cyncCommon/utils/helper";

@Component({
  selector: "app-fee-tires-form",
  templateUrl: "./fee-tires-form.component.html",
  styleUrls: ["./fee-tires-form.component.scss"],
})
export class FeeTiresFormComponent implements OnInit {
  fee_tiers: any = [];
  factoringFeeSetupForm: FormGroup;
  isEditable: boolean = true;
  daysFrom: any;
  toDays: any;
  tierPerent: any;
  feeTierLength: any;
  showFeeTier: boolean;
  feeSetupData: any;
  maxFee: Number;

  constructor(
    private fb: FormBuilder,
    private feeSetupService: FactoringFeeSetupService,
    private helper: Helper,
    private domRender: Renderer2
  ) {}

  ngOnInit() {
    this.feeSetupService.getEditValue().subscribe((res) => {
      this.isEditable = res;
    });
    this.getfeeTiersData();
    this.feeSetupService.getFeeCalculationMethod().subscribe((res) => {
      if (res === false) {
        this.showFeeTier = true;
      } else if (res === true) {
        this.showFeeTier = false;
      }
    });
    this.feeSetupService.getMaximumFeeValue().subscribe((res) => {
      this.maxFee = res;
    });
  }

  getfeeTiersData() {
    this.feeSetupService.getFeeTierData().subscribe((res) => {
      this.feeSetupData = res;
      this.fee_tiers = res.fee_setup.fee_codes_attributes;
      if (res.fee_setup.fee_calculation_method === "tier_based") {
        this.showFeeTier = true;
      } else if (res.fee_setup.fee_calculation_method === "per_day") {
        this.showFeeTier = false;
      }
    });
  }

  onAddTier() {
    if (
      this.fee_tiers.length >= 1 &&
      this.fee_tiers[this.fee_tiers.length - 1].tier_days === "" &&
      this.fee_tiers[this.fee_tiers.length - 1].tier_percent === ""
    ) {
      this.helper.openAlertPoup(
        "",
        "DaysTo/Total fee cannot be empty or the values are invalid"
      );
    } else if (
      this.fee_tiers.length >= 1 &&
      (this.fee_tiers[this.fee_tiers.length - 1].tier_days === "" ||
        this.fee_tiers[this.fee_tiers.length - 1].tier_percent === "")
    ) {
      this.helper.openAlertPoup(
        "",
        "DaysTo/Total fee cannot be empty or the values are invalid"
      );
    } else {
      let k;
      if (this.fee_tiers.length === 0) {
        k = 1;
      } else {
        k = 1 + Number(this.fee_tiers[this.fee_tiers.length - 1].tier_days);
      }
      this.fee_tiers.push({
        tier_days: "",
        tier_percent: "",
        days_from: k,
      });
      this.feeTierLength = this.fee_tiers.length;
    }
  }
  daysFromvalue(event: any) {
    this.daysFrom = event.target.value;
    this.fee_tiers[this.feeTierLength - 1].days_from = event.target.value;
  }
  toDaysValue(event: any, index: number) {
    var elm = document.getElementById(event.target.id) as HTMLInputElement;
    if (Number(event.target.value) < this.fee_tiers[index].days_from) {
      this.fee_tiers[index].tier_days = event.target.value;
      this.domRender.addClass(elm, "borderRed");
      this.helper.openAlertPoup(
        "",
        "DaysTo value cannot be less than DaysFrom"
      );
    } else {
      this.domRender.removeClass(elm, "borderRed");
      this.toDays = event.target.value;
      this.fee_tiers[index].tier_days = event.target.value;
    }
  }
  tierPercentValue(event: any, index: string) {
    if (event.target.value > this.maxFee) {
      this.fee_tiers[index].tier_percent = event.target.value;
      this.helper.openAlertPoup(
        "",
        "Tier Fee cannnot be greater than Maximum Fee"
      );
    } else {
      this.tierPerent = event.target.value;
      this.fee_tiers[index].tier_percent = event.target.value;
      this.feeSetupService.setFeeTierData1(this.fee_tiers);
    }
  }

  onEnterTierPercent(event: any, index: number) {
    var elm = document.getElementById(event.target.id) as HTMLInputElement;
    if (event.target.value > this.maxFee) {
      this.domRender.addClass(elm, "borderRed");
    } else {
      this.domRender.removeClass(elm, "borderRed");
    }
  }

  onDeleteTier() {
    this.fee_tiers.pop();
    this.feeSetupService.setFeeTierData1(this.fee_tiers);
  }

  onEnterTireDays(elm: any, index: number) {
    let elmvalue = elm.target.value;
    if (this.fee_tiers.length > 1) {
      this.fee_tiers[index + 1].days_from = 1 + Number(elmvalue);
    }
  }
}
