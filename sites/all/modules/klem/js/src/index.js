import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import React from 'react';
import ReactDOM from 'react-dom';
//import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';


(function ($) {

    function getCurrentNodeId(){
        let $body = $('body.page-node');
        if (! $body.length )
        {
            return false;
        }
        let bodyClasses = $body.attr('class').split(/\s+/);
        for ( let i in bodyClasses)
        {
            let c = bodyClasses[i];
            if (c.length > 10 && c.substring(0,10) === "page-node-")
                return parseInt(c.substring(10), 10);
        }
        return false;
    }

    Drupal.behaviors.klem_load_remote_content = {

        attach: function (context, settings) {

            //var id = getCurrentNodeId();
            var user = settings.klem.user;
            var token = settings.klem.token;
            var node = settings.klem.node;
            var id = settings.klem.id;
            var credits = settings.klem.credits;
            var timer = settings.klem.timer;
            var wrong_answer_credits = settings.klem.wrong_answer_credits;
            var time_end_credits = settings.klem.time_end_credits;
            var hint_credits = settings.klem.hint_credits;
            var credits_per_round = settings.klem.credits_per_round;
            var credits_one_time = settings.klem.credits_one_time;

            var pubDate = node.field_publicatiedatum["und"][0]['value'];

            if (id === 1422)
            {
                id = settings.klem.demo_nid;
            }

            if (user.uid === "0")
            {
                user.uid = "20585";

                user.apikeys.puzzel_data = {};
                user.apikeys.api_service.api_key = "***API_KEY***";
                user.apikeys.api_service.token = "***SERVICE_TOKEN***";
                user.apikeys.puzzel_data.api_key = "***DATA_API_KEY***";
                user.apikeys.puzzel_data.token = "***DATA_TOKEN***";
            }

            ReactDOM.render(<App node={id} user={user} token={token} pubDate={pubDate} creditsInit={credits} timerInit={timer}
            wrongAnswerCredits={wrong_answer_credits} timeEndCredits={time_end_credits} hintCredits={hint_credits}
            creditsPerRoundInit={credits_per_round} creditsOneTimeInit={credits_one_time}/>, document.getElementById('root'));
        }
    };

})(jQuery);


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
