const fs = require('fs');
const path = require('path');

const iconMap = {
  ArrowRight: 'FaArrowRight',
  Shield: 'FaShieldAlt',
  Star: 'FaStar',
  ChevronLeft: 'FaChevronLeft',
  ChevronRight: 'FaChevronRight',
  Check: 'FaCheck',
  LayoutDashboard: 'FaThLarge',
  Users: 'FaUsers',
  MessageSquare: 'FaCommentAlt',
  Megaphone: 'FaBullhorn',
  FileText: 'FaFileAlt',
  Workflow: 'FaProjectDiagram',
  CreditCard: 'FaCreditCard',
  Settings: 'FaCog',
  LogOut: 'FaSignOutAlt',
  Menu: 'FaBars',
  X: 'FaTimes',
  Zap: 'FaBolt',
  Plus: 'FaPlus',
  Power: 'FaPowerOff',
  Trash2: 'FaTrash',
  Send: 'FaPaperPlane',
  UserPlus: 'FaUserPlus',
  Download: 'FaDownload',
  Upload: 'FaUpload',
  XCircle: 'FaTimesCircle',
  AlertCircle: 'FaExclamationCircle',
  Calendar: 'FaCalendarAlt',
  Clock: 'FaClock',
  Mail: 'FaEnvelope',
  Phone: 'FaPhone',
  Search: 'FaSearch',
  Filter: 'FaFilter',
  MoreVertical: 'FaEllipsisV',
  Edit: 'FaEdit',
  ChevronDown: 'FaChevronDown',
  ChevronUp: 'FaChevronUp',
  Eye: 'FaEye',
  EyeOff: 'FaEyeSlash',
  Lock: 'FaLock',
  Unlock: 'FaUnlock',
  Image: 'FaImage',
  Link: 'FaLink',
  ExternalLink: 'FaExternalLinkAlt',
  Info: 'FaInfoCircle',
  Play: 'FaPlay',
  Pause: 'FaPause',
  RefreshCw: 'FaSync',
  Copy: 'FaCopy',
  Globe: 'FaGlobe',
  MapPin: 'FaMapMarkerAlt',
  Briefcase: 'FaBriefcase',
  Building: 'FaBuilding',
  Home: 'FaHome',
  ShoppingCart: 'FaShoppingCart',
  Tag: 'FaTag',
  Percent: 'FaPercentage',
  DollarSign: 'FaDollarSign',
  Award: 'FaAward',
  ThumbsUp: 'FaThumbsUp',
  Heart: 'FaHeart',
  Share2: 'FaShareAlt',
  MessageCircle: 'FaRegComment',
  TrendingUp: 'FaChartLine',
  BarChart2: 'FaChartBar',
  PieChart: 'FaChartPie',
  Activity: 'FaHeartbeat',
  Cpu: 'FaMicrochip',
  Database: 'FaDatabase',
  Server: 'FaServer',
  HardDrive: 'FaHdd',
  Monitor: 'FaDesktop',
  Smartphone: 'FaMobileAlt',
  Wifi: 'FaWifi',
  Bluetooth: 'FaBluetooth',
  Battery: 'FaBatteryFull',
  Camera: 'FaCamera',
  Video: 'FaVideo',
  Mic: 'FaMicrophone',
  Music: 'FaMusic',
  Volume2: 'FaVolumeUp',
  VolumeX: 'FaVolumeMute',
  Headphones: 'FaHeadphones',
  Tv: 'FaTv',
  Radio: 'FaBroadcastTower',
  Sun: 'FaSun',
  Moon: 'FaMoon',
  Cloud: 'FaCloud',
  Umbrella: 'FaUmbrella',
  Wind: 'FaWind',
  Droplet: 'FaTint',
  Thermometer: 'FaThermometerHalf',
  Compass: 'FaCompass',
  Map: 'FaMap',
  Navigation: 'FaLocationArrow',
  Anchor: 'FaAnchor',
  Flag: 'FaFlag',
  Crosshair: 'FaCrosshairs',
  Target: 'FaBullseye',
  ShieldCheck: 'FaShieldAlt',
  Key: 'FaKey',
  Unlock: 'FaUnlock',
  Lock: 'FaLock',
  User: 'FaUser',
  UserCheck: 'FaUserCheck',
  UserMinus: 'FaUserMinus',
  UserX: 'FaUserTimes',
  Users: 'FaUsers',
  Book: 'FaBook',
  BookOpen: 'FaBookOpen',
  Bookmark: 'FaBookmark',
  File: 'FaFile',
  Folder: 'FaFolder',
  FolderPlus: 'FaFolderPlus',
  FolderMinus: 'FaFolderMinus',
  Archive: 'FaArchive',
  Box: 'FaBox',
  Inbox: 'FaInbox',
  Paperclip: 'FaPaperclip',
  Scissors: 'FaCut',
  Clipboard: 'FaClipboard',
  Printer: 'FaPrint',
  Coffee: 'FaCoffee',
  Gift: 'FaGift',
  Smile: 'FaSmile',
  Frown: 'FaFrown',
  Meh: 'FaMeh',
  ThumbsDown: 'FaThumbsDown',
  StarHalf: 'FaStarHalf',
  Loader2: 'FaSpinner'
};

function processDirectory(dirPath) {
  const files = fs.readdirSync(dirPath);
  for (const file of files) {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (!fullPath.includes('node_modules') && !fullPath.includes('.next')) {
        processDirectory(fullPath);
      }
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Remove AI text
      content = content.replace(/AI-powered/g, 'automated');
      content = content.replace(/Generate Template Messages with AI/g, 'Generate Template Messages');
      content = content.replace(/using AI\. No copywriting skills needed/g, 'instantly. No copywriting skills needed');
      content = content.replace(/AI chatbots/g, 'automated chatbots');
      
      // Process lucide-react imports
      const importRegex = /import\s+\{([^}]+)\}\s+from\s+['"]lucide-react['"];?/g;
      let match;
      let newImports = new Set();
      
      while ((match = importRegex.exec(content)) !== null) {
        const icons = match[1].split(',').map(i => i.trim()).filter(i => i);
        icons.forEach(icon => {
          if (iconMap[icon]) {
            newImports.add(iconMap[icon]);
            // Replace <IconName with <FaIconName
            const tagRegex = new RegExp(`<${icon}\\b`, 'g');
            content = content.replace(tagRegex, `<${iconMap[icon]}`);
            const tagCloseRegex = new RegExp(`<\/${icon}>`, 'g');
            content = content.replace(tagCloseRegex, `</${iconMap[icon]}>`);
            
            // Handle if icon is passed as a component prop or object value
            const exactWordRegex = new RegExp(`\\b${icon}\\b`, 'g');
            content = content.replace(exactWordRegex, iconMap[icon]);
          } else {
             console.log(`Missing mapping for ${icon} in ${fullPath}`);
          }
        });
      }
      
      if (newImports.size > 0) {
        content = content.replace(importRegex, `import { ${Array.from(newImports).join(', ')} } from "react-icons/fa";`);
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Processed: ${fullPath}`);
      } else {
        // Just write AI text replacements
        fs.writeFileSync(fullPath, content, 'utf8');
      }
    }
  }
}

processDirectory(path.join(__dirname, 'app'));
processDirectory(path.join(__dirname, 'components'));
