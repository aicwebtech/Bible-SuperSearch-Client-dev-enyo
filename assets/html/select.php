<?php

    session_start();
    error_reporting(E_ALL);
    ini_set('display_errors', 1);
    $default_interface = $_SESSION['interface'] ?? 'Expanding';
    $interface = $_REQUEST['interface'] ?? $default_interface;
    $_SESSION['interface'] = $interface;
    $interfaces = getInterfaces();

    $config = file_get_contents('config.js');
    // $config = substr($config, 38);
    //$config = json_decode(trim($config));
    // var_dump(json_last_error());
    //$config['interface'] = $interface;

    // $config = str_replace('"interface": "Expanding"', '"interface":"' . $interface . '"', $config);
    // $config = str_replace('"interface":', '"interface":"' . $interface . '", //', $config);

    $test = isset($_REQUEST['test']) ? (bool) $_REQUEST['test'] : false;
    $testVerbose = isset($_REQUEST['test_verbose']) ? (bool) $_REQUEST['test_verbose'] : false;
?>

<html>
    <head>
        <meta charset="utf-8">
        <meta http-equiv="x-ua-compatible" content="ie=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Bible SuperSearch</title>
        <link rel="stylesheet" href="biblesupersearch.css">
        <style>
            #selector {
                width: 100%;
                max-width: 400px;
                margin: 0 auto 0;
            }

            #selector label.s, #selector input.s {
                display: inline-block;
                width: 40px;
            }

            #selector select {
                width: calc(100% - 100px);
            }
        </style>
        <script>
            <?php echo $config; ?>;

            biblesupersearch_config_options.interface = '<?php echo $interface; ?>';
            biblesupersearch_config_options.testOnLoad = <?php echo $test ? 'true' : 'false'; ?>;
            biblesupersearch_config_options.testVerbose = <?php echo $testVerbose ? 'true' : 'false'; ?>;

            <?php if($test): ?>
                biblesupersearch_config_options.landingReference = null; // disable landing reference if testing
            <?php endif; ?>

        </script>
        <script src="biblesupersearch.js"></script>
        <link rel="stylesheet" href="https://code.jquery.com/qunit/qunit-2.21.0.css">
        <script src="https://code.jquery.com/qunit/qunit-2.21.0.js"></script>
    </head>
    <body>
        <form id='selector'>
            <label class='s'>Skin: </label>
            <select name='interface'>
                <?php foreach($interfaces as $key => $i): ?>
                    <?php $selected = $key == $interface ? " selected='selected'" : ''; ?>

                    <option value='<?php echo $key;?>' <?php echo $selected;?> >
                        <?php echo $i['name']; ?>        
                    </option>
                <?php endforeach; ?>
            </select>
            <input type='submit' value='GO' /><br />

            <input type='checkbox' name='test' id='test' value='1' <?php if($test) echo "checked=checked" ?> />
            <label for='test'><small>Run Tests</small></label>            
            <input type='checkbox' name='test_verbose' id='test_verbose' value='1' <?php if($testVerbose) echo "checked=checked" ?> />
            <label for='test_verbose'><small>Verbose Tests</small></label>
        </form>

        <div id="qunit" style='position: relative;'></div>
        <div id="qunit-fixture"></div>

        <hr />

        <div id='biblesupersearch_container'>
            <noscript class='biblesupersearch_noscript'>Please enable JavaScript to use</noscript>
        </div>

    </body>
</html>

<?php


function getInterfaces() 
{
    
    return array(
        'Expanding' => array(
            'name'  => 'Expanding', 
            'class' => 'expanding',
        ),
        'ExpandingLargeInput' => array(
            'name'  => 'Expanding - Large Input', 
            'class' => 'expanding',
        ),                          
        'BrowsingBookSelector' => array(
            'name'  => 'Browsing with Book Selector', 
            'class' => 'browsing',
        ),              
        'BrowsingBookSelectorHorizontal' => array(
            'name'  => 'Browsing with Book Selector, Horizontal Form', 
            'class' => 'browsing',
        ),              
        'Classic' => array(
            'name'  => 'Classic (alias of Classic - User Friendly 2)',  // alias ClassicUserFriendly2
            'class' => 'classic',
        ),            
        'ClassicUserFriendly1' => array(
            'name'  => 'Classic - User Friendly 1', 
            'class' => 'classic',
        ),                  
        'ClassicUserFriendly2' => array(
            'name'  => 'Classic - User Friendly 2', 
            'class' => 'classic',
        ),            
        'ClassicParallel2' => array(
            'name'  => 'Classic - Parallel 2', 
            'class' => 'classic',
        ),
        'ClassicAdvanced' => array(
            'name'  => 'Classic - Advanced', 
            'class' => 'classic',
        ),                 
        'Minimal' => array(
            'name'  => 'Minimal', 
            'class' => 'minimal'
        ),              
        'MinimalWithBible' => array(
            'name'  => 'Minimal with Bible', 
            'class' => 'minimal'
        ),               
        'MinimalWithBibleWide' => array(
            'name'  => 'Minimal with Bible - Wide', 
            'class' => 'minimal'
        ),              
        'MinimalWithShortBible' => array(
            'name'  => 'Minimal with Short Bible', 
            'class' => 'minimal'
        ),              
        'MinimalWithParallelBible' => array(
            'name'  => 'Minimal with Parallel Bible', 
            'class' => 'minimal'
        ),               
        'MinimalGoRandom' => array(
            'name'  => 'Minimal Go Random', 
            'class' => 'minimal'
        ),                
        'MinimalGoRandomBible' => array(
            'name'  => 'Minimal Go Random with Bible', 
            'class' => 'minimal'
        ),            
        'MinimalGoRandomParallelBible' => array(
            'name'  => 'Minimal Go Random with Parallel Bible', 
            'class' => 'minimal'
        ),
        'CustomUserFriendly2BookSel' => array(
            'name'  => 'Custom - User Friendly 2 with Book Selector', 
            'class' => 'classic',
        ),   
    );
}
