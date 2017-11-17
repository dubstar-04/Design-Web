

function getUMToken(){
    //create a request and tell it where the json that I want is
    var req = new XMLHttpRequest();
    //var location = path
    var url = "https://api.youmagine.com/integrations/design-app/authorized_integrations/new?redirect_url=design-app&deny_url={deny_url}"

    //tell the request to go ahead and get the json
    req.open("GET", url, true);
    req.send(null);

    //wait until the readyState is 4, which means the json is ready
    req.onreadystatechange = function()
    {
        if (req.readyState == 4)
        {

            console.log(req.responseText);
            //io.write(name, req.responseText)

        }
    };
}


