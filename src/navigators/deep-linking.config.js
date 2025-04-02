export const config = {
    screens: {
        TabNav: {
            screens: {
                HomeNav: {
                    initialRouteName: "Home",
                    screens: {
                        Home: "home",
                        DiscoverHome: "discover",
                        Instrument: {
                            path: "instrument/:instrumentId",
                            parse: {
                                instrumentId: Number
                            }
                        }
                    }
                },
                CommunityNav: {
                    initialRouteName: "CommunityHome",
                    screens: {
                        CommunityHome: "community",
                        Leaderboard: "community/leaderboard",
                        CommunityTransactions: "community/transactions",
                        CommunityPortfolio: {
                            path: "community/portfolio/:portfolioId",
                            parse: {
                                portfolioId: Number
                            }
                        },
                    }
                },
            }
        },
        // SettingsNav: {

        // },
        // ModalNav: {

        // },
        // PaywallNav: {
        //     initialRouteName: "Home",
        //     screens: {
        //         PaywallModal: "paywall"
        //     }
        // }
    }
};