$(() => {

    // Lava Lamp

    // Set up canvas

    const canvas = document.getElementById('canvas');
    canvas.width = innerWidth;
    canvas.height = parseInt( $('body').css('height') );
    const c = canvas.getContext('2d');

    // Return a circle object

    function circle() {
        return {
            x: Math.random() * 500 + canvas.width - 700,
            y: Math.random() * canvas.height,
            speed: Math.random() * 4 + 1,
            radius: Math.random() * 80 + 20,
            color: Math.random() > 0.7 ? "#ffffff" : "#000000"
        }
    }

    // Init 30 circles

    let circles = Array(30).fill().map(() => circle());

    // Animate

    function animate() {
        requestAnimationFrame(animate);
        c.clearRect(0, 0, canvas.width, canvas.height);
        circles = circles.map(render);
    }
    animate();

    // Render

    function render(circle) {
        circle.y -= circle.speed;
        if (circle.y < -circle.radius) {
            circle.y = canvas.height + circle.radius;
        }
        
        c.beginPath();
        c.fillStyle = circle.color;
        c.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
        c.fill();

        return circle;
    }

    // Form

    $('form').on('submit', handle_form);

    function handle_form(ev) {
        ev.preventDefault();
        $('#loader').show();

        const formData = new FormData(this);
        const xhr = new XMLHttpRequest();

        fetch("http://ohmangoec.com/mail.php", { method: 'POST', body: formData })
            .then(res => res.text())
            .then(text => {
                if (text == "1") message(true, "Message sent successfully");
                else message(false, "There was an error when trying to send your message");
            });
    }

    function message(success, text) {
        $('#loader').hide();
        const color = success ? "#5cb85c" : "#d9534f";
        $('#message')
            .html(text)
            .css({ color })
            .slideDown();
    }

});
