from webapp import app
import os
port = os.environ.get('PORT', 5001)
try:
    port = int(port)
    app.run(debug=True, host='0.0.0.0', port=port)
except ValueError as e:
    print('Tyra not started: {}'.format(e))
