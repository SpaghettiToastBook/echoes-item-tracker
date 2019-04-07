"use strict";

let items = {
    upgrades: [
        "missile_launcher",
        "dark_beam",
        "light_beam",
        "annihilator_beam",
        "dark_suit",
        "morph_ball_bomb",
        "violet_translator",
        
        "super_missile",
        "darkburst",
        "sunburst",
        "sonic_boom",
        "light_suit",
        "power_bomb",
        "amber_translator",
        
        "seeker_launcher",
        "",
        "dark_visor",
        "echo_visor",
        "",
        "boost_ball",
        "emerald_translator",
        
        "energy_transfer_module",
        "space_jump_boots",
        "gravity_boost",
        "grapple_beam",
        "screw_attack",
        "spider_ball",
        "cobalt_translator",
    ],
    
    expansions: {
        energy_tank: {max: 14, per: 100},
        missile_expansion: {max: 49, per: 5},
        power_bomb_expansion: {max: 8, per: 1},
        beam_ammo_expansion: {max: 4, per: 50},
        dark_ammo_expansion: {max: 10, per: 20},
        light_ammo_expansion: {max: 10, per: 20},
    },
    
    keys: {
        dark_agon_key: 3,
        dark_torvus_key: 3,
        ing_hive_key: 3,
        sky_temple_key: 9,
    },
};

let expansions_order = [
    "energy_tank",
    "missile_expansion",
    "power_bomb_expansion",
    "beam_ammo_expansion",
    "dark_ammo_expansion",
    "light_ammo_expansion",
];
let keys_order = [
    "dark_agon_key",
    "dark_torvus_key",
    "ing_hive_key",
    "sky_temple_key",
];
let item_list = items.upgrades.filter(u => u != "").concat(expansions_order)
for (let k of keys_order) {
    for (let n = 0; n < items.keys[k]; n++) {
        item_list.push(k + "_" + String(n + 1))
    };
};

function formatted_name(item_name) {
    return item_name.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());
};

let upgrades_collected = new Set();

function upgrade_onclick(u) {
    return function() {
        let u_elt = document.getElementById(u);
        let u_box = document.getElementById(u + "-box");
        if (upgrades_collected.has(u)) {
            upgrades_collected.delete(u)
            u_elt.classList.remove("collected");
            u_box.classList.remove("collected");
        } else {
            upgrades_collected.add(u)
            u_elt.classList.add("collected");
            u_box.classList.add("collected");
        };
        update_expansion_texts()
    };
};

let upgrade_tracker_div = document.getElementById("upgrade-tracker");
for (let u of items.upgrades) {
    if (u != "") {
        let u_div = document.createElement("div");
        u_div.id = u + "-box";
        u_div.className = "image-box";
        u_div.addEventListener("click", upgrade_onclick(u));
        upgrade_tracker_div.appendChild(u_div);
        
        let u_img = document.createElement("img");
        u_img.id = u;
        u_img.className = "upgrade";
        u_img.src = "images/" + u + ".gif";
        u_img.title = formatted_name(u);
        u_div.appendChild(u_img);
    } else {
        upgrade_tracker_div.appendChild(document.createElement("div"));
    };
};

let expansion_counts = {
    energy_tank: 0,
    missile_expansion: 0,
    power_bomb_expansion: 0,
    beam_ammo_expansion: 0,
    dark_ammo_expansion: 0,
    light_ammo_expansion: 0,
};

function update_expansion_texts() {
    for (let e of expansions_order) {
        document.getElementById(e + "-count").innerHTML = "× " + String(expansion_counts[e]) + "/" + String(items.expansions[e].max);
        
        if (e == "beam_ammo_expansion") {
            let dark_total = expansion_counts[e] * items.expansions[e].per;
            if (upgrades_collected.has("dark_beam")) {
                dark_total += document.getElementById("S-dark-ammo-given").valueAsNumber;
            };
            let light_total = expansion_counts[e] * items.expansions[e].per;
            if (upgrades_collected.has("light_beam")) {
                light_total += document.getElementById("S-light-ammo-given").valueAsNumber;
            };
            document.getElementById(e + "-total").innerHTML = "(total: " + String(dark_total) + " D, " + String(light_total) + " L)";
        } else {
            let total = 0;
            if (e == "energy_tank") {
                total += 99;
            } else if (e == "missile_expansion") {
                if (upgrades_collected.has("missile_launcher")) {
                    total += document.getElementById("S-missiles-given-launcher").valueAsNumber;
                };
                if (upgrades_collected.has("seeker_launcher")) {
                    total += document.getElementById("S-missiles-given-seeker").valueAsNumber;
                };
            } else if (e == "power_bomb_expansion" && upgrades_collected.has("power_bomb")) {
                total += document.getElementById("S-power-bombs-given").valueAsNumber;
            } else if (e == "dark_ammo_expansion" && upgrades_collected.has("dark_beam")) {
                total += document.getElementById("S-dark-ammo-given").valueAsNumber;
            } else if (e == "light_ammo_expansion" && upgrades_collected.has("light_beam")) {
                total += document.getElementById("S-light-ammo-given").valueAsNumber;
            };
            total += expansion_counts[e] * items.expansions[e].per
            document.getElementById(e + "-total").innerHTML = "(total: " + String(total) + ")";
        };
    };
};

let ammo_elts = {
    split: [
        "dark_ammo_expansion",
        "dark_ammo_expansion-box",
        "dark_ammo_expansion-count",
        "dark_ammo_expansion-total",
        "light_ammo_expansion",
        "light_ammo_expansion-box",
        "light_ammo_expansion-count",
        "light_ammo_expansion-total",
    ],
    nosplit: [
        "beam_ammo_expansion",
        "beam_ammo_expansion-box",
        "beam_ammo_expansion-count",
        "beam_ammo_expansion-total",
    ]
};
function update_split_ammo(split) {
    for (let a_elt of ammo_elts.split) {
        document.getElementById(a_elt).hidden = !split;
    };
    for (let a_elt of ammo_elts.nosplit) {
        document.getElementById(a_elt).hidden = split;
    };
    document.getElementById("S-beam_ammo_expansion-per").disabled = split;
    document.getElementById("S-dark_ammo_expansion-per").disabled = !split;
    document.getElementById("S-light_ammo_expansion-per").disabled = !split;
};

function expansion_onclick(e) {
    return function(event) {
        if (event.shiftKey && expansion_counts[e] > 0) {
            expansion_counts[e]--;
        } else if (!event.shiftKey && expansion_counts[e] < items.expansions[e].max) {
            expansion_counts[e]++;
        };
        update_expansion_texts()
    };
};

let expansion_tracker_div = document.getElementById("expansion-tracker");
for (let e of expansions_order) {
    let e_div = document.createElement("div");
    e_div.id = e + "-box";
    e_div.className = "image-box";
    e_div.addEventListener("click", expansion_onclick(e));
    expansion_tracker_div.appendChild(e_div);
    
    let e_img = document.createElement("img");
    e_img.id = e;
    e_img.src = "images/" + e + ".gif";
    e_img.title = formatted_name(e);
    e_div.appendChild(e_img);
    
    let e_count = document.createElement("div");
    e_count.id = e + "-count";
    e_count.className = "expansion-text";
    expansion_tracker_div.appendChild(e_count);
    
    let e_total = document.createElement("div");
    e_total.id = e + "-total";
    e_total.className = "expansion-text";
    expansion_tracker_div.appendChild(e_total);
    
    document.getElementById("S-" + e + "-per").addEventListener("change",
        function(event) {
            items.expansions[e].per = event.target.valueAsNumber;
            update_expansion_texts();
        }
    )
};
update_expansion_texts();
update_split_ammo(false);

let keys_collected = {
    dark_agon_key: new Set(),
    dark_torvus_key: new Set(),
    ing_hive_key: new Set(),
    sky_temple_key: new Set(),
};

function key_onclick(k, n) {
    let kn = k + "_" + String(n + 1);
    return function() {
        let kn_elt = document.getElementById(kn);
        let kn_box = document.getElementById(kn + "-box");
        if (keys_collected[k].has(n)) {
            keys_collected[k].delete(n)
            kn_elt.classList.remove("collected");
            kn_box.classList.remove("collected");
        } else {
            keys_collected[k].add(n)
            kn_elt.classList.add("collected");
            kn_box.classList.add("collected");
        };
    };
};

let key_tracker_div = document.getElementById("key-tracker");
for (let k of keys_order) {
    let k_label = document.createElement("div");
    k_label.className = "key-label";
    k_label.innerHTML = formatted_name(k) + "s:";
    key_tracker_div.appendChild(k_label)
    
    for (let n = 0; n < items.keys[k]; n++) {
        if (n == 3 || n == 6) {
            key_tracker_div.appendChild(document.createElement("div"));
        };
        
        let kn = k + "_" + String(n + 1);
        
        let k_div = document.createElement("div");
        k_div.id = kn + "-box";
        k_div.className = "image-box";
        k_div.addEventListener("click", key_onclick(k, n));
        key_tracker_div.appendChild(k_div);
        
        let k_img = document.createElement("img");
        k_img.id = kn;
        k_img.className = "key";
        k_img.src = "images/" + k + ".gif";
        k_img.title = formatted_name(kn);
        k_div.appendChild(k_img);
    };
};

document.getElementById("S-dark").addEventListener("change", event => document.body.classList.toggle("dark", event.target.checked));

let animation_checkbox = document.getElementById("S-animation")
animation_checkbox.addEventListener("change",
    function(event) {
        let dir = (event.target.checked) ? "images" : "images-noanim"
        for (let i of item_list) {
            document.getElementById(i).src = dir + "/" + i.replace(/_\d$/, "") + ".gif";
        };
    }
);

let boxes_checkbox = document.getElementById("S-boxes")
boxes_checkbox.addEventListener("change",
    function(event) {
        for (let i of item_list) {
            document.getElementById(i + "-box").classList.toggle("boxes", event.target.checked)
        };
    }
);

let ammo_split_checkbox = document.getElementById("S-ammo-split");
ammo_split_checkbox.addEventListener("change", event => update_split_ammo(event.target.checked));

let number_given_inputs = [
    "S-missiles-given-launcher",
    "S-missiles-given-seeker",
    "S-power-bombs-given",
    "S-dark-ammo-given",
    "S-light-ammo-given",
];
for (let ng_input of number_given_inputs) {
    document.getElementById(ng_input).addEventListener("change", event => update_expansion_texts())
};

document.getElementById("settings").addEventListener("reset",
    function(event) {
        let f = event.target;
        window.setTimeout(
            function() {
                for (let elt of f.elements) {
                    elt.dispatchEvent(new Event("change"));
                };
            }
        )
    }
)

document.getElementById("reset-trackers").addEventListener("click",
    function(event) {
        for (let u of new Set(upgrades_collected)) {
            upgrade_onclick(u)()
        };
        
        for (let e of expansions_order) {
            expansion_counts[e] = 0;
        };
        update_expansion_texts();
        
        for (let k of keys_order) {
            for (let n of new Set(keys_collected[k])) {
                key_onclick(k, n)();
            }; 
        };
    }
)